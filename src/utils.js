const mobile = '(max-width: 800px)'
const getTime = (index) => {
    return `${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`;
}


export { mobile, getTime }