<!-- @format -->

# Gym Advisor - Defects Log

## How to Use This Log

Each defect should be logged with the following information:

- **ID**: Unique identifier (DEF-001, DEF-002, etc.)
- **Test Case**: Reference to the test case that exposed the defect
- **Title**: Brief description of the issue
- **Description**: Detailed explanation of the problem
- **Steps to Reproduce**: Exact steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Severity**: Critical/High/Medium/Low
- **Priority**: High/Medium/Low
- **Status**: New/In Progress/Fixed/Verified/Closed
- **Assigned To**: Team member responsible for fixing
- **Reported By**: Tester who found the issue
- **Reported Date**: When the issue was found
- **Screenshots/Evidence**: Any visual proof (if applicable)

## Defect Template

```
## DEF-[ID]

**Test Case**: TC-[ID]
**Title**: [Brief description]
**Description**: [Detailed explanation]

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:
**Actual Behavior**:

**Severity**: [Critical/High/Medium/Low]
**Priority**: [High/Medium/Low]
**Status**: [New/In Progress/Fixed/Verified/Closed]

**Assigned To**:
**Reported By**:
**Reported Date**:

**Screenshots/Evidence**:
[Attach or link screenshots if applicable]
```

## Defects List

<!-- New defects will be added here -->

### DEF-001

**Test Case**: TC-004
**Title**: Login button unresponsive after multiple attempts

**Description**: After several failed login attempts in quick succession, the login button becomes unresponsive for approximately 30 seconds.

**Steps to Reproduce**:

1. Navigate to login page
2. Enter incorrect credentials
3. Click 'Sign In'
4. Repeat steps 2-3 five times in quick succession
5. Enter correct credentials
6. Click 'Sign In'

**Expected Behavior**: User should be able to log in with correct credentials
**Actual Behavior**: Login button remains unresponsive for approximately 30 seconds

**Severity**: Medium
**Priority**: High
**Status**: New

**Assigned To**: Unassigned
**Reported By**: Test Team
**Reported Date**: 2023-10-15

**Screenshots/Evidence**: N/A

### DEF-002

**Test Case**: TC-012
**Title**: Gym filters do not persist after page refresh

**Description**: When applying filters to the gym list and then refreshing the page, all filter selections are lost and results revert to unfiltered.

**Steps to Reproduce**:

1. Navigate to 'Gyms' page
2. Apply multiple filters (e.g., rating, amenities)
3. Refresh the page

**Expected Behavior**: Filter selections should persist after page refresh
**Actual Behavior**: All filter selections are lost and results revert to unfiltered

**Severity**: Low
**Priority**: Medium
**Status**: New

**Assigned To**: Unassigned
**Reported By**: Test Team
**Reported Date**: 2023-10-16

**Screenshots/Evidence**: N/A
