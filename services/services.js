const findOne = async (table, param) => {
    const item = await table.findOne(param)
    return item;
}

const findById = async (table, id) => {
    const item = await table.findById(id)
    return item;
}

const find = async (table) => {
    const item = await table.find()
    return item;
}

const findByIdAndUpdate = async (table, id) => {
    const item = await table.findByIdAndUpdate(id)
    return item;
}

const findByIdAndDelete = async (table, id) => {
    const item = await table.findByIdAndDelete(id)
    return item;
}


module.exports = {
    findOne,
    findById,
    find,
    findByIdAndUpdate,
    findByIdAndDelete
}