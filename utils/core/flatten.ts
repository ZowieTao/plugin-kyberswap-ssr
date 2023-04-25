import { Fragment } from 'react';

export const flattenChildren = (children: any): any => {
  return Array.isArray(children)
    ? [].concat(
        ...children.map((c) => {
          return c?.type === Fragment
            ? flattenChildren(c.props.children)
            : flattenChildren(c);
        }),
      )
    : [children];
};
