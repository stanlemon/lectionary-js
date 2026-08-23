import { BaseYear } from "./BaseYear.js";
/**
 * Calculates important liturgical days for a given calendar year.
 */
export declare class Year extends BaseYear {
    #private;
    /**
     * Calculates important liturgical days for a given calendar year.
     * @param {number | string} year Year to calculate dates for.
     */
    constructor(year: number | string);
    getAdvent(): Date;
    getChristmas(): Date;
    getEpiphany(): Date;
    getEpiphanySunday(): Date;
    getTransfiguration(): Date;
    getAshWednesday(): Date;
    getLent(): Date;
    getEaster(): Date;
    getTrinity(): Date;
    getPentecost(): Date;
    getLastSunday(): Date;
    getEndOfYear(): Date;
}
