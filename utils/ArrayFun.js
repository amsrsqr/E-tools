export function SortArrayOfObjs(array, fieldName, order) {
  console.log("field name", fieldName);
  function compare(a, b) {
    if (a[fieldName] < b[fieldName]) {
      return -1;
    }
    if (a[fieldName] > b[fieldName]) {
      return 1;
    }
    return 0;
  }
  function Descompare(a, b) {
    if (a[fieldName] > b[fieldName]) {
      return -1;
    }
    if (a[fieldName] < b[fieldName]) {
      return 1;
    }
    return 0;
  }
  return array.sort(order && order === "desc" ? Descompare : compare);
}
