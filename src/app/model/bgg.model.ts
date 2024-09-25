export interface BggItem {
  description: string
  average_seconds_checked_out: number
  object_type: string
  overall_condition: string
  condition_notes: any
  catalog_number: string
  last_checkout_date: string
  _options: Options
  is_play_to_win: number
  bgg_id: number
  date_updated: string
  max_players: number
  view_uri: string
  library_id: string
  name: string
  game_weight: number
  checkout_count: number
  uri_part: string
  custom_fields: CustomFields
  is_in_circulation: number
  missing_instructions: number
  object_name: string
  is_checked_out: number
  publisher_name: string
  id: string
  box_unacceptable: number
  max_play_time: number
  age: number
  min_players: number
  last_checkin_date: string
  notes: any
  lastcheckout_id: string
  date_created: string
  min_play_time: number
  missing_components: number
  due_for_triage: number
}

export interface Options {
  _box_unacceptable: BoxUnacceptable
  _is_in_circulation: IsInCirculation
  missing_components: number[]
  _is_checked_out: IsCheckedOut
  due_for_triage: number[]
  _overall_condition: OverallCondition
  is_in_circulation: number[]
  missing_instructions: number[]
  _missing_instructions: MissingInstructions
  _due_for_triage: DueForTriage
  overall_condition: string[]
  is_checked_out: number[]
  _is_play_to_win: IsPlayToWin
  _missing_components: MissingComponents
  box_unacceptable: number[]
  is_play_to_win: number[]
}

export interface BoxUnacceptable {
  "0": string
  "1": string
}

export interface IsInCirculation {
  "1": string
  "0": string
}

export interface IsCheckedOut {
  "1": string
  "0": string
}

export interface OverallCondition {
  unplayable: string
  fair: string
  verygood: string
  mint: string
  good: string
  poor: string
}

export interface MissingInstructions {
  "0": string
  "1": string
}

export interface DueForTriage {
  "0": string
  "1": string
}

export interface IsPlayToWin {
  "0": string
  "1": string
}

export interface MissingComponents {
  "0": string
  "1": string
}

export interface CustomFields {
  ItemType: string
  Location: string
  BGGRank: string
}

export interface Paging {
  total_pages: number
  page_number: string
  next_page_number: number
  items_per_page: string
  previous_page_number: number
  total_items: number
}
