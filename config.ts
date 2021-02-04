import {config} from './index';
import {COMMUNITY as COMMUNITY_ID} from "arverify";
import {tokenAllocation} from "./arverify-distribution";


const config: config = {
  emission_period: 2592000, // E
  time_interval: 86400, // I
  initial_emit_amount: 96775, // A
  decay_const: undefined, // k
  token_contract_id: COMMUNITY_ID,
  token_allocations: tokenAllocation(),
};

export default config;
