/**
 * Get type of array elements
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
/**
 * Get type of object certain property
 */
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
