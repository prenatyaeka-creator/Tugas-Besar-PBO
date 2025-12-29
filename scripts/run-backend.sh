#!/usr/bin/env bash
set -euo pipefail
# Run Spring Boot backend using XAMPP MySQL (make sure DB is imported first)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../backend"

# Load env if exists
if [ -f ".env.xampp.sh" ]; then
  # shellcheck disable=SC1091
  source ".env.xampp.sh"
fi

echo "\n[TaskMate] Starting backend..."
echo "Java: $(java -version 2>&1 | head -n 1 || true)"

if [ -x "./mvnw" ]; then
  ./mvnw spring-boot:run
elif command -v mvn >/dev/null 2>&1; then
  mvn spring-boot:run
else
  echo "Error: Maven not found. Install Maven (brew install maven) or add Maven Wrapper (mvnw) to the backend." >&2
  exit 1
fi
