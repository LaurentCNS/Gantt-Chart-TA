import {isBoolean} from "ngx-tethys/util";

export class ItemsFilter {
  id!: string;
  title!: string;
  start: number | undefined;
  end: number | undefined;
  color!: string;
  is_late !: boolean;
  is_closed !: boolean;
  ref!: number;
}
