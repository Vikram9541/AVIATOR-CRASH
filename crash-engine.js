const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://angvxvuovzbfyxblogrv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let multiplier = 1.0;
let crashPoint = parseFloat((Math.random() * 4 + 1).toFixed(2));
let status = 'running';

function resetGame() {
  multiplier = 1.0;
  crashPoint = parseFloat((Math.random() * 4 + 1).toFixed(2));
  console.log(`New round. Will crash at ${crashPoint}x`);
}

async function updateGameState() {
  const { error } = await supabase
    .from("game_state")
    .update({
      multiplier,
      crash_point: crashPoint,
      status
    })
    .eq("id", 1);

  if (error) console.error("Update error:", error);
}

async function gameLoop() {
  setInterval(async () => {
    if (multiplier >= crashPoint) {
      status = "crashed";
      await updateGameState();
      console.log(`💥 Crashed at ${multiplier.toFixed(2)}x`);
      await new Promise(r => setTimeout(r, 5000));
      resetGame();
      status = "running";
    } else {
      multiplier += 0.05;
      await updateGameState();
    }
  }, 100);
}

resetGame();
gameLoop();
