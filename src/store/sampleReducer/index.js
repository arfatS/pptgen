/**
 * How to create a reducer list and actions to dispatch on network call
 * Steps:
 * 1. Create a seperate reducer directory with types, actions and index [Reducer List file]
 * 2. Define constants in types.js and export them
 * 3. Import the types in the index as defined below
 * 4. Import createReducersFromTypes to dynamically create reducers from types
 * 5. Create actions with the types constants and export them.
 * 6. Import the actions in your component(s)/service to dispatch them based on the need.
 *
 * !NOTE: Refer other constants reducers, before creating type constants
 */

import * as types from "./types";
import createReducersFromTypes from "store/createReducersFromTypes";

export default createReducersFromTypes(types);
