type GetSelectedFieldsOptions = {
  fields: Record<string, any>;
  alias?: string;
  excludeRelations?: boolean;
  includePrimaryKey?: boolean;
};

export function getSelectedFields({
  fields,
  alias = "",
  excludeRelations = false,
  includePrimaryKey = true,
}: GetSelectedFieldsOptions): Record<string, string> {
  const selected: Record<string, string> = {};
  const prefix = alias ? `${alias}.` : "";
  const keyPrefix = alias ? `${alias}_` : "";

  // Include primary key (id) if requested
  if (includePrimaryKey) {
    selected[`${keyPrefix}id`] = `${prefix}id`;
  }

  for (const key in fields) {
    const value = fields[key];

    // Skip internal GraphQL fields
    if (key.startsWith("__")) continue;

    // Skip relation fields when excludeRelations is true
    if (
      excludeRelations &&
      value &&
      typeof value === "object" &&
      Object.keys(value).length > 0
    ) {
      continue;
    }

    // This is a scalar field (leaf node)
    if (
      !value ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      // Avoid adding `id` again if already added
      if (!(includePrimaryKey && key === "id")) {
        selected[`${keyPrefix}${key}`] = `${prefix}${key}`;
      }
    }
  }

  return selected;
}
