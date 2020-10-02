
import indexOf from "@newdash/newdash/indexOf";


export const cutByIndexArray = (s = "", a = []) => {
  const rt = [];
  if (a && a.length > 0) {
    rt.push(s.slice(0, a[0]));
    for (let i = 0; i < a.length - 1; i++) {
      const cut = a[i] + 1;
      const cutNext = a[i + 1];
      rt.push(s.slice(cut, cutNext));
    }
    rt.push(s.slice(a[a.length - 1] + 1));
    return rt;
  }
  return [s];
};

export const secureSplit = (s = "", delimiter = ",") => {
  const cuts = [];
  let i = -1;
  while ((i = indexOf(s, delimiter, i + 1)) != -1) {
    if (cuts.length >= 1) {
      const beforeCut = cuts[cuts.length - 1];
      // @ts-ignore
      if (indexOf(s.slice(beforeCut + 1, i), "<")) {
        continue;
      }
    }
    cuts.push(i);
  }

  if (cuts) {
    return cutByIndexArray(s, cuts);
  }

  return [s];
};