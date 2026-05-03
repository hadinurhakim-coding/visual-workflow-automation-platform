import { parseAsInteger, parseAsString } from "nuqs";
import { PAGINATION } from "@/config/constants";

export const credentialsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),
};
