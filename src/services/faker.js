const { faker } = require('@faker-js/faker')


//configuro idioma de faker a español
faker.locale = 'es'

const mocks = []

const createMocks = (cantidad) => {
    let id = mocks.length ? (mocks.length + 1) : 1

    for (var i = 0; i < cantidad; i++){
        mocks.push({
            id:id,
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(),
            timestamp: faker.date.recent(),
            descripcion: faker.commerce.productDescription(),
            codigo: faker.datatype.string(5),
            stock: faker.datatype.number(100)
        })
        id++
    }

    //return mocks
}

const getMocks = (id) => {
    if (id){
        return mocks[id - 1]
    }

    return mocks
}

const insertMock = (mock) => {
    mock.id = mocks.length + 1
    mocks.push(mock)
}

const updateMock = (id, mockUpdated) => {
    const mockId = id - 1
    mockUpdated.id = id
    mocks[mockId] = mockUpdated

    return true
}

const deleteMock = (id) => {
    mocks.splice(id-1, 1)

    return true
}


module.exports = { createMocks, getMocks, insertMock, updateMock, deleteMock }