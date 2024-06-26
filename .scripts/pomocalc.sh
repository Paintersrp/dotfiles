#!/bin/bash
# Script to calculate the total study time from the total focused time
# Using 25 minute Pomodoros with 5 minute breaks, and a 30 minute break after every 4th pomo,
# the average break time per Pomodoro cycle is 11.25, so I use 36.25 minutes per cycle as total time.

# for debugging:
#set -exo pipefail

# stop the script if an error occurs
set -e

# if no argument, more than 2 or less than 2 arguments are given, stop the script by returning 1
if [[ -z "$1$2" || $# -gt 2 || $# -lt 2 ]]; then
	echo "usage: pomocalc HOURS MINUTES"
	exit 1
fi

if [[ $1 -lt 0 || $2 -lt 0 ]]; then
	echo -n "Error: Please enter positive numbers for hours and minutes"
	exit 1
fi

minutes=$(("$1" * 60 + "$2"))
cycles=$(("$minutes" / 25))
total_minutes=$(echo "$cycles * 36.25" | bc)
printf "Your focus time was %i hours %i minutes\n" "$1" "$2"
printf "Total study time is %0.f hours %0.f minutes\n" "$(echo "$total_minutes / 60" | bc)" "$(echo "$total_minutes % 60" | bc)"

# the %0.f in the printf rounds the numbers
