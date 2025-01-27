const serializeData = (obj: any) => {
    // nextjs does not support returning decimal values
    // we will convert decimal into number
    const serialized = { ...obj }

    if (serialized.balance) {
        serialized["balance"] = serialized["balance"].toNumber()
    }

    if (serialized.amount) {
        serialized["amount"] = serialized["amount"].toNumber()
    }

    return serialized
}

export default serializeData