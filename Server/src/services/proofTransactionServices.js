import ApplicationError from '../common/errors.js';
import dbInitPromise from '../database/initialize.js';
import imageServices from './imageServices.js';
const { ProofTransaction } = await dbInitPromise;

async function createProofTransaction(proofImage, transactionId, userId)
{
    const [image] = await imageServices.createImages([proofImage], userId);
    const proofImageId  = image.id;
    const model = await ProofTransaction.create({
        transactionId,
        proofImageId
    })
    return model.toJSON();
}

async function fetchProofTransaction(transactionId)
{
    const model = await ProofTransaction.findByPk(transactionId, {
        attributes: [],
        include: imageServices.include('serve')
    });
    if(!model) throw new ApplicationError('No associated proof transaction found', 500);

    return model.toJSON();
}

function include(level)
{
    switch (level) {
        case 'serveWithImage':
            return {
                model: ProofTransaction,
                attributes: [],
                include: imageServices.include('serve')
            }
        default:
            return { model: ProofTransaction }
    }
}

export default {
    createProofTransaction,
    fetchProofTransaction,
    include
};