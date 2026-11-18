let pipelinePromise;
const models = new Map();
async function getPipeline(task, modelId) {
  const key = `${task}:${modelId}`;
  if (!models.has(key)) models.set(key, (async () => {
    if (!pipelinePromise) pipelinePromise = import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2');
    const { pipeline } = await pipelinePromise;
    return pipeline(task, modelId, { dtype: 'q8', progress_callback: (p) => self.postMessage({ type: 'progress', progress: p }) });
  })());
  return models.get(key);
}
self.onmessage = async ({ data }) => {
  const { requestId, mode, chunks, src, dst } = data;
  try {
    const summarizing = mode === 'summarize';
    const model = await getPipeline(summarizing ? 'summarization' : 'translation', summarizing ? 'Xenova/distilbart-cnn-6-6' : 'Xenova/nllb-200-distilled-600M');
    const output = [];
    for (let i = 0; i < chunks.length; i++) {
      self.postMessage({ type: 'progress', message: `${summarizing ? 'Summarizing' : 'Translating'} section ${i + 1} of ${chunks.length}…` });
      const result = summarizing ? await model(chunks[i], { max_new_tokens: 140, min_new_tokens: 20 }) : await model(chunks[i], { src_lang: src, tgt_lang: dst, max_new_tokens: 180 });
      output.push(summarizing ? result[0].summary_text : result[0].translation_text);
    }
    self.postMessage({ type: 'done', requestId, text: output.join('\n\n') });
  } catch (error) { self.postMessage({ type: 'error', requestId, message: error?.message || 'AI model failed to load or process this document.' }); }
};
