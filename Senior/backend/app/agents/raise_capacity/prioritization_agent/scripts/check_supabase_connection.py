"""
Manual connection check: confirms SUPABASE_URL/SUPABASE_KEY in your local
.env can reach the real Supabase project with a single, safe read query.

Run:
    python -m scripts.check_supabase_connection
"""

from app.integrations.supabase_client import get_supabase_client


def main() -> None:
    client = get_supabase_client()
    response = client.table("Program").select("Program_ID, Program_Name").limit(1).execute()
    print("Connected to Supabase.")
    print(f"Sample row(s) from Program: {response.data}")


if __name__ == "__main__":
    main()
