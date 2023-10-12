import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uiaoojuactfohovzhvws.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpYW9vanVhY3Rmb2hvdnpodndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5NDM4MzksImV4cCI6MjAxMjUxOTgzOX0.IQyfAQ7yO_i5ZAvcUDkTGl7Tr7N-0ij4hFafYp348NA";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
