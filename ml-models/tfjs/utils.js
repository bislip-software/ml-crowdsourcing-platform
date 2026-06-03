const tf = require('@tensorflow/tfjs');
const Model = require('../../models/Model');

async function saveModel(model, documentId) {
  await model.save(tf.io.withSaveHandler(async (artifacts) => {
    
    // 1. Convert the weights ArrayBuffer into a Node.js Buffer
    const weightsBuffer = artifacts.weightData 
      ? Buffer.from(artifacts.weightData) 
      : null;

    // 2. Package the topology along with its weight specifications
    const topologyPackage = {
      modelTopology: artifacts.modelTopology,
      format: artifacts.format,
      generatedBy: artifacts.generatedBy,
      convertedBy: artifacts.convertedBy,
      weightSpecs: artifacts.weightSpecs // Critical for TF to map the buffer correctly
    };

    // 3. Update your existing document
    await Model.findByIdAndUpdate(
      documentId,
      {
        modelTopology: topologyPackage,
        modelWeights: weightsBuffer
      },
      { new: true }
    );

    return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: 'JSON' } };
  }));

  console.log('Model data successfully attached to document!');
}

async function loadModel(documentId) {
  // Fetch your document
  const doc = await Model.findById(documentId);
  if (!doc || !doc.modelTopology || !doc.modelWeights) {
    throw new Error('Model data missing or document not found.');
  }

  // Safely extract the exact ArrayBuffer slice from the Node Buffer
  const weightsArrayBuffer = doc.modelWeights.buffer.slice(
    doc.modelWeights.byteOffset,
    doc.modelWeights.byteOffset + doc.modelWeights.byteLength
  );

  // Reconstruct using the properties stored in your schema
  const model = await tf.loadLayersModel(tf.io.fromMemory(
    doc.modelTopology.modelTopology,
    doc.modelTopology.weightSpecs,
    weightsArrayBuffer
  ));
  
  return model;
}

module.exports = {
  saveModel,
  loadModel
};