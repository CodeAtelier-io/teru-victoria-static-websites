#!/bin/sh
# Runtime config assembly for the white-label build.
#
# One image serves every brand. The app fetches /config.json at startup; this
# script (run by nginx's /docker-entrypoint.d/ hook before nginx starts) renders
# config.json entirely from environment variables — brand identity, theme,
# contact, feature flags, and the indexed keyFigures / products arrays — so a
# brand is configured per-instance from the server's .env, no rebuild needed.
set -eu

ROOT=/usr/share/nginx/html
TPL=/etc/teru-victoria/config.template.json

# Feature flags are emitted unquoted (JSON booleans), so they must never be
# empty. Default anything unset to false.
export FEATURE_SHOW_MISSION="${FEATURE_SHOW_MISSION:-false}"
export FEATURE_SHOW_COMPETENCIES="${FEATURE_SHOW_COMPETENCIES:-false}"
export FEATURE_SHOW_PRODUCTS="${FEATURE_SHOW_PRODUCTS:-false}"
export FEATURE_SHOW_KEY_FIGURES="${FEATURE_SHOW_KEY_FIGURES:-false}"
export FEATURE_SHOW_NEWS="${FEATURE_SHOW_NEWS:-false}"

# Read a dynamically-named env var (e.g. KEY_FIGURES_2_VALUE), empty if unset.
get() { eval "printf '%s' \"\${$1:-}\""; }

# Build the keyFigures JSON array from KEY_FIGURES_COUNT + indexed vars.
build_key_figures() {
  n=$(get KEY_FIGURES_COUNT); n=${n:-0}
  out="["; sep=""; i=1
  while [ "$i" -le "$n" ]; do
    v=$(get "KEY_FIGURES_${i}_VALUE")
    l=$(get "KEY_FIGURES_${i}_LABEL_KEY")
    out="${out}${sep}{\"value\":\"${v}\",\"labelKey\":\"${l}\"}"
    sep=","; i=$((i + 1))
  done
  printf '%s]' "$out"
}

# Build the products JSON array from PRODUCTS_COUNT + indexed vars.
build_products() {
  n=$(get PRODUCTS_COUNT); n=${n:-0}
  out="["; sep=""; i=1
  while [ "$i" -le "$n" ]; do
    name=$(get "PRODUCTS_${i}_NAME_KEY")
    desc=$(get "PRODUCTS_${i}_DESC_KEY")
    img=$(get "PRODUCTS_${i}_IMAGE")
    out="${out}${sep}{\"nameKey\":\"${name}\",\"descKey\":\"${desc}\",\"image\":\"${img}\"}"
    sep=","; i=$((i + 1))
  done
  printf '%s]' "$out"
}

export KEY_FIGURES_JSON="$(build_key_figures)"
export PRODUCTS_JSON="$(build_products)"

envsubst < "$TPL" > "${ROOT}/config.json"
echo "[30-runtime-config] rendered config.json for brand '${BRAND:-?}'"
