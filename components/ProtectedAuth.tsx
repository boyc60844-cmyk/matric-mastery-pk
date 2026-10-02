/* ==========================================================================
   PROTECTED AUTHENTICATION MODULE - DO NOT OVERWRITE OR REMOVE
   This module preserves critical Firebase Authentication for Punjab Board Matric students.
   Contains:
   - Google Auth Provider integration via existing src/firebase
   - User state sync across Header, Dashboard, and Leaderboard
   - Student avatar + XP display
   - Cloud Login action
   ========================================================================== */

"use client";

import React from "react";
import AuthButton from "./AuthButton";

export { default as AuthButton } from "./AuthButton";

export default function ProtectedAuth() {
  return <AuthButton />;
}
