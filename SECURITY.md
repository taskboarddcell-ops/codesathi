# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email the security team at: security@codesathi.com (or the appropriate contact)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Known Security Considerations

### API Key Exposure

**⚠️ IMPORTANT**: The current implementation exposes the Gemini API key to the client-side bundle. This is acceptable for development and demo purposes but should be addressed before production deployment.

**Recommended Production Approach:**
1. Create a backend API proxy for AI requests
2. Store API keys server-side only
3. Implement rate limiting on the proxy
4. Add request validation and sanitization

Example architecture:
```
Client → Your Backend API → Gemini API
         (with API key)
```

**Temporary Mitigation:**
- Use API key restrictions in Google Cloud Console
- Set usage quotas
- Monitor API usage regularly
- Rotate keys periodically

## Security Best Practices

### Environment Variables

**Never commit sensitive data:**
```bash
# ❌ DO NOT DO THIS
VITE_SUPABASE_ANON_KEY=actual-key-here

# ✅ DO THIS INSTEAD
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

All sensitive configuration should be in `.env.local` which is gitignored.

**Note on VITE_ prefix:**
- Variables with `VITE_` prefix are exposed to the client
- Only use `VITE_` for non-sensitive data (like Supabase anon key with RLS)
- Keep sensitive keys (like Gemini API key) without `VITE_` prefix for server-side only

### Authentication

- ✅ Always use Supabase Auth for authentication
- ✅ Store tokens securely (handled by Supabase SDK)
- ✅ Use Row Level Security (RLS) policies
- ✅ Validate session on every request
- ❌ Never store passwords in plain text
- ❌ Never expose API keys in client-side code

### Data Protection

- ✅ Use HTTPS in production
- ✅ Enable RLS on all Supabase tables
- ✅ Validate all user inputs
- ✅ Sanitize data before display
- ❌ Never trust client-side data
- ❌ Never expose internal IDs or structure

### API Security

- ✅ Rate limit API calls
- ✅ Validate all inputs
- ✅ Use CORS restrictions
- ✅ Implement proper error handling (no sensitive data in errors)
- ❌ Don't expose stack traces in production
- ❌ Don't log sensitive information

## Security Features

### Built-in Protections

1. **XSS Protection**: React automatically escapes content
2. **CSRF Protection**: Supabase handles token-based auth
3. **SQL Injection**: Supabase uses parameterized queries
4. **Content Security Policy**: Configured in index.html

### Supabase Security

- **Row Level Security (RLS)**: All tables should have RLS policies
- **API Keys**: Anon key is safe for client-side use (with RLS)
- **JWT Tokens**: Short-lived, automatically refreshed

Example RLS Policy:
```sql
-- Users can only read their own data
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

## Security Checklist

### Before Deployment

- [ ] All environment variables are properly set
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced
- [ ] Error messages don't expose sensitive data
- [ ] API rate limiting is configured
- [ ] Security headers are set
- [ ] Dependencies are up to date (no known vulnerabilities)
- [ ] Secrets are not in source code
- [ ] Authentication is properly tested
- [ ] Input validation is in place
- [ ] **API keys moved to backend proxy** ⚠️

### Regular Maintenance

- [ ] Run `npm audit` monthly
- [ ] Update dependencies quarterly
- [ ] Review access logs
- [ ] Rotate API keys annually
- [ ] Review and update RLS policies
- [ ] Monitor for unusual activity

## Production Recommendations

### Backend API Setup

To properly secure API keys in production:

1. **Create a backend service** (Node.js/Express, Next.js API routes, or similar)
2. **Move Gemini API calls to backend**:
   ```typescript
   // Backend endpoint
   app.post('/api/ai/chat', authenticate, async (req, res) => {
     const { message } = req.body;
     const response = await geminiClient.chat(message);
     res.json(response);
   });
   ```
3. **Update frontend to call your API**:
   ```typescript
   const response = await fetch('/api/ai/chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message })
   });
   ```

### Rate Limiting

Implement rate limiting to prevent abuse:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Secure Development

### Code Review

All code changes should be reviewed for:
- Input validation
- Output encoding
- Authentication checks
- Authorization checks
- Error handling
- Logging (no sensitive data)

### Dependencies

- Keep dependencies updated
- Run `npm audit` regularly
- Review dependency licenses
- Use lock files (package-lock.json)
- Avoid unnecessary dependencies

### Testing

- Test authentication flows
- Test authorization boundaries
- Test input validation
- Test error handling
- Test rate limiting

## Security Headers

Configured in production:

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

Additional headers in server configuration:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `Referrer-Policy`

## Incident Response

If a security incident occurs:

1. **Contain**: Immediately stop the vulnerability
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users
4. **Fix**: Deploy patches
5. **Review**: Conduct post-mortem
6. **Improve**: Update security practices

## Compliance

### Data Privacy

- GDPR compliance (if applicable)
- COPPA compliance (children's data)
- Data retention policies
- User data deletion requests

### Child Safety

- Age-appropriate content only
- Parental controls
- Safe communication
- Monitored AI interactions

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html)

## Contact

For security concerns: security@codesathi.com

For general issues: Use GitHub Issues

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve our security.
