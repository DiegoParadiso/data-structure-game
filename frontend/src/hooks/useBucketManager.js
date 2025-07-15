export function validateBuckets(bucketsToValidate, maxNumber) {
  const getTotalBits = (max) => (max == null ? 0 : Math.ceil(Math.log2(max + 1)));
  const totalBits = getTotalBits(maxNumber);

  for (const bucketId in bucketsToValidate) {
    const bucket = bucketsToValidate[bucketId];
    if (!bucket) continue;
    if (bucket.every((node) => node == null)) continue;

    for (const node of bucket) {
      if (node == null) continue;
      const number = typeof node === 'number' ? node : node.decimal;
      const binaryValue = number.toString(2).padStart(totalBits, '0');
      const nodeBitsRelevant = binaryValue.slice(-bucketId.length);
      if (nodeBitsRelevant !== bucketId) return false;
    }
  }
  return true;
}

export function splitBucketHelper(buckets, bucketId, maxNumber, extendBucketCallback) {
  const getTotalBits = (max) => (max == null ? 0 : Math.ceil(Math.log2(max + 1)));
  const newDepth = bucketId.length + 1;
  if (newDepth > 3) {
    // si ya es profundo, extender bucket
    return extendBucketCallback(bucketId, buckets);
  }

  const totalBits = getTotalBits(maxNumber);
  const items = buckets[bucketId] || [];
  const bucket0Items = [];
  const bucket1Items = [];

  for (const val of items) {
    if (!val) continue;
    const decimalValue = typeof val === 'number' ? val : val.decimal;
    const binary = decimalValue.toString(2).padStart(totalBits, '0');
    const nextBitIndex = totalBits - newDepth;
    const nextBit = binary[nextBitIndex] || '0';
    if (nextBit === '0') bucket0Items.push(val);
    else bucket1Items.push(val);
  }

  const curr = parseInt(bucketId, 2);
  const newKey0 = curr.toString(2).padStart(newDepth, '0');
  const newKey1 = (curr + (1 << (newDepth - 1))).toString(2).padStart(newDepth, '0');

  const fillToSize = (arr, size = 3) => {
    while (arr.length < size) arr.push(null);
    return arr.slice(0, size);
  };

  const newBuckets = { ...buckets };
  delete newBuckets[bucketId];
  newBuckets[newKey0] = fillToSize(bucket0Items);
  newBuckets[newKey1] = fillToSize(bucket1Items);

  return newBuckets;
}

export function extendBucketHelper(buckets, bucketId) {
  const current = buckets[bucketId] || [];
  const newSize = current.length * 2 || 2;
  const extended = [...current];
  while (extended.length < newSize) extended.push(null);
  return { ...buckets, [bucketId]: extended };
}
