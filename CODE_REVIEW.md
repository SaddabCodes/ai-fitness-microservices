# Code Review - Backend & Frontend Issues

## Frontend Issues

### 1. **ActivityList.jsx - Grid component issue (Line 31)**
**Issue**: Using `size` prop with Grid component (old Grid2 syntax)
```javascript
<Grid size={{ xs: 12, sm: 6, md: 4 }}>  // ❌ WRONG
```
**Fix**: Grid component uses `xs`, `sm`, `md` props directly with `item` attribute
```javascript
<Grid item xs={12} sm={6} md={4}>  // ✅ CORRECT
```

### 2. **ActivityForm.jsx - Error message handling (Line 44)**
**Issue**: Trying to access `error.response?.data?.message` but backend returns `error` field
```javascript
const responseMessage = error.response?.data?.message;  // Backend returns "error" not "message"
```
**Fix**: Should check for `error` field that GlobalExceptionHandler returns
```javascript
const responseMessage = error.response?.data?.error || error.response?.data?.errors?.type;
```

### 3. **App.jsx - Missing navigation setup (Line 6)**
**Issue**: Routes are nested inside a div that shows only when logged in, but Router needs to wrap everything for proper routing

### 4. **ActivityList.jsx - Missing error handling (Line 22)**
**Issue**: API call fails silently with only `console.error`. Should show user-friendly error message

## Backend Issues

### 1. **ActivityRequest.java - userId field issue**
**Status**: ✅ Fixed - `@NotBlank` annotation was removed
The userId is injected by controller from X-User-ID header, not from request body

### 2. **ActivityService.java - No logging for debugging (Line 27-30)**
**Issue**: User validation fails silently. Should log why validation failed
```java
boolean isValidUser = userValidationService.validateUser(request.getUserId());
if (!isValidUser) {
    throw new RuntimeException("Invalid User: "+ request.getUserId());  // No logging
}
```

### 3. **UserValidationService.java - Exception swallowing (Line 21-23)**
**Issue**: When validation fails, exception is caught and `false` is returned without logging
```java
catch (WebClientRequestException e) {
    e.printStackTrace();  // Not proper logging
}
return false;  // Silent failure
```

### 4. **ActivityServiceApplication.java - Missing configuration**
**Issue**: When running from IntelliJ, Config Server import is not configured
**Fix**: Ensure `application.yml` has:
```yaml
spring:
  config:
    import: optional:configserver:http://localhost:8888
```

### 5. **GlobalExceptionHandler.java - Recently added**
**Status**: ✅ Good - provides detailed error messages for validation failures

## Critical Issue: Eureka Registration Failure

**Problem**: Activity-service can't be found by gateway (503 SERVICE_UNAVAILABLE)

**Root Cause**: When running from IntelliJ:
- Config Server configuration not loaded
- Eureka instance metadata not set correctly
- Service registers with wrong hostname

**Solution**: Always run services via Maven:
```bash
cd backend/activity-service
./mvnw spring-boot:run
```

This ensures:
- ✅ Config Server configuration is loaded
- ✅ Eureka instance is registered with correct IP
- ✅ Service discovery works properly

## Summary of Fixes Needed

### Frontend (2 Critical Fixes)
1. [ ] ActivityList.jsx Line 31: Change `size` prop to `item xs sm md` syntax
2. [ ] ActivityForm.jsx Line 44: Update error field name from `message` to `error`

### Backend (Already Fixed/Working)
1. [x] ActivityRequest - @NotBlank removed from userId
2. [x] GlobalExceptionHandler - Added for better error messages
3. [ ] Add proper logging instead of printStackTrace()
4. [ ] Always run via Maven, not IntelliJ

### Verification Steps
1. Kill all services
2. Start in correct order via Maven:
   - Config Server
   - Eureka
   - User Service
   - Activity Service (with fixed pom.xml - Java 21)
   - AI Service
   - API Gateway
3. Log out, clear localStorage, log back in
4. Try adding activity
5. Verify activity appears in list