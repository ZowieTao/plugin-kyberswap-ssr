// from: https://github.com/AsyncBanana/microdiff

interface Difference {
  type: 'CREATE' | 'REMOVE' | 'CHANGE';
  path: (string | number)[];
  value?: any;
}
interface Options {
  cyclesFix: boolean;
}

const t = true;
const richTypes = { Date: t, RegExp: t, String: t, Number: t };

export function isEqual(oldObj: any, newObj: any): boolean {
  return (
    diff(
      {
        obj: oldObj,
      },
      { obj: newObj },
    ).length < 1
  );
}

export const isNotEqual = (oldObj: any, newObj: any) => {
  return !isEqual(oldObj, newObj);
};

function diff(
  obj: Record<string, any> | any[],
  newObj: Record<string, any> | any[],
  options: Partial<Options> = { cyclesFix: true },
  _stack: Record<string, any>[] = [],
): Difference[] {
  const diffs: Difference[] = [];
  const isObjArray = Array.isArray(obj);

  for (const key in obj) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const objKey = obj[key];
    const path = isObjArray ? Number(key) : key;
    if (!(key in newObj)) {
      diffs.push({
        type: 'REMOVE',
        path: [path],
      });
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newObjKey = newObj[key];
    const areObjects =
      typeof objKey === 'object' && typeof newObjKey === 'object';
    if (
      objKey &&
      newObjKey &&
      areObjects &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      !richTypes[Object.getPrototypeOf(objKey).constructor.name] &&
      (options.cyclesFix ? !_stack.includes(objKey) : true)
    ) {
      const nestedDiffs = diff(
        objKey,
        newObjKey,
        options,
        options.cyclesFix ? _stack.concat([objKey]) : [],
      );
      // eslint-disable-next-line prefer-spread
      diffs.push.apply(
        diffs,
        nestedDiffs.map((difference) => {
          difference.path.unshift(path);

          return difference;
        }),
      );
    } else if (
      objKey !== newObjKey &&
      !(
        areObjects &&
        (Number.isNaN(objKey)
          ? String(objKey) === String(newObjKey)
          : Number(objKey) === Number(newObjKey))
      )
    ) {
      diffs.push({
        path: [path],
        type: 'CHANGE',
        value: newObjKey,
      });
    }
  }

  const isNewObjArray = Array.isArray(newObj);

  for (const key in newObj) {
    if (!(key in obj)) {
      diffs.push({
        type: 'CREATE',
        path: [isNewObjArray ? Number(key) : key],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value: newObj[key],
      });
    }
  }

  return diffs;
}
