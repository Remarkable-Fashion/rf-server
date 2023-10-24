package date

import (
	"time"
)

// getPastDateISOString returns the ISO string of the date that is 'days' days before 'now'.
func getPastDateISOString(days int, now time.Time) string {
	pastDate := now.AddDate(0, 0, -days)
	isoString := pastDate.Format(time.RFC3339)
	return isoString // removing the seconds and timezone offset to match the TypeScript function
	// return isoString[:len(isoString)-5] // removing the seconds and timezone offset to match the TypeScript function
}

// GetDateRange returns a map with the ISO strings of 'now' and 30 days before 'now'.
func GetDateRange(now time.Time) map[string]string {
	thirtyDaysAgoISOString := getPastDateISOString(30, now)
	nowISOString := now.Format(time.RFC3339) // removing the seconds and timezone offset to match the TypeScript function
	// nowISOString := now.Format(time.RFC3339)[:len(now.Format(time.RFC3339))-5] // removing the seconds and timezone offset to match the TypeScript function

	dateRange := map[string]string{
		"gte": thirtyDaysAgoISOString,
		"lte": nowISOString,
	}

	return dateRange
}

// func main() {
// 	now := time.Now()
// 	dateRange := GetDateRange(now)
// 	fmt.Printf("Date Range: %+v\n", dateRange)
// }
