export default (name: string) => {
  const names = name.toLowerCase().replace(/'/g, '');
  const n = names.match(/[a-zA-Z0-9]+/g);
  let n1 = n.join(' ');
  n1 = n1.replace(/ +/g, '_');
  n1 = n1.replace('/\\//g', '');
  return n1;
};
