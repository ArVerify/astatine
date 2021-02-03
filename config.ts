import {config} from './index';
import {COMMUNITY as COMMUNITY_ID} from "arverify";
import {tokenAllocation} from "./arverify-distribution";


const config: config = {
  emission_period: 0, // E
  time_interval: 0, // I
  initial_emit_amount: 0, // A
  decay_const: 0, // k
  token_contract_id: COMMUNITY_ID,
  token_allocations: tokenAllocation(),
};

export default config;
