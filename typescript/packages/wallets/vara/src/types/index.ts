import { Chain } from "@goat-sdk/core";

export type VaraChainType = {
    type: "substrate";
    id: "vara";
    name: "Vara Network";
    currency: { symbol: "VARA"; decimals: 18 };
    rpcUrl: string;
    explorer?: string;
};
