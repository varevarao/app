/**
 * Extracts the fields from a template string
 * @param  {String} string Template string
 * @return {Array}         Field names
 * @example
 *
 * getFieldsFromTemplateString("{{ title }} — {{ runtime }}");
 * // -> ["title", "runtime"]
 */
export default function getFieldsFromTemplateString(string) {
  const regex = /(?<={{)(.*?)(?=}})/g;
  let fields = string.match(regex);
  fields = fields.map(field => field.trim());
  return fields;
}
