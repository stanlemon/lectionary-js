import { Year } from "../Year.js";

export class ThreeYear extends Year {
  getTransfiguration() {
    // Sunday before Ash Wednesday = Easter − 7 weeks (no pre-Lent season)
    return this.getEaster().minus({ weeks: 7 });
  }
}
