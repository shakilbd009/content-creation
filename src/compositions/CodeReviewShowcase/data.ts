export const COMMAND = "/review-pr 247";

export const BAD_CODE = `for item in items:
    item.details = db.query(Details)
        .filter_by(id=item.detail_id)
        .first()`;

export const FIXED_CODE = `detail_ids = [item.detail_id for item in items]
details = db.query(Details).filter(
    Details.id.in_(detail_ids)
).all()
details_map = {d.id: d for d in details}`;

export const PHASE = {
  // Hero overlay
  HERO_START: 0,
  HERO_END: 70,

  // Terminal appears and command
  TERMINAL_APPEAR: 50,
  COMMAND_START: 80,
  COMMAND_DONE: 110,

  // Analysis
  STATUS_1: 120,
  STATUS_2: 140,
  STEP_1: 160,
  FOUND_ISSUE: 180,

  // Warning + bad code + query visualization
  WARNING_APPEAR: 200,
  BAD_CODE_APPEAR: 240,
  QUERY_VIZ_START: 260,
  QUERY_VIZ_FIRING: 280, // arrows start firing

  // Performance meter appears
  METER_APPEAR: 320,

  // Explanation
  EXPLANATION_APPEAR: 360,

  // Fix phase
  FIX_STATUS: 420,
  FIXED_CODE_APPEAR: 450,

  // Transformation - visuals change
  TRANSFORM_START: 520,
  TRANSFORM_END: 580,

  // Final
  FINAL_STATUS: 620,

  // Scroll phases
  SCROLL_1_START: 220,
  SCROLL_1_END: 280,
  SCROLL_2_START: 400,
  SCROLL_2_END: 460,
  SCROLL_3_START: 550,
  SCROLL_3_END: 620,

  END: 750,
} as const;
