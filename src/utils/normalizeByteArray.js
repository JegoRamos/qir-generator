module.exports.convertToString = (byteArray) => {
  const bytesView = new Uint8Array(byteArray)

  /* Parsed string will have 0 after every character */
  const bytesWithoutZero = bytesView.filter(byte => byte !== 0)

  return new TextDecoder().decode(bytesWithoutZero)
}