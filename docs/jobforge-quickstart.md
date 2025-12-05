# JobForge - Quick Start Guide

## Getting Started

JobForge is now fully integrated into your application! Here's how to start using it.

---

## 🚀 Accessing JobForge

### From Navigation
1. Look for **JobForge** in the left sidebar (HomeSidebar)
2. It appears after Calendar with a briefcase icon
3. The badge shows your current draft count

### Direct URLs
- **Dashboard**: `/jobforge`
- **Create New Job**: `/jobforge/create`
- **My Drafts**: `/jobforge/drafts`

---

## 📝 Creating Your First Job

### Step 1: Open the Job Composer
- Click **"Create New Job"** from the dashboard, or
- Navigate directly to `/jobforge/create`

### Step 2: Fill in Basic Information
```
Job Title: "Senior Software Engineer"
Industry: "Technology"
Seniority Level: "Senior"
Location: "Manchester"
Work Type: "Hybrid"
Salary Range: 60,000 to 80,000 GBP
```

### Step 3: Use AI to Generate Description
1. Enter notes in the text area:
   ```
   We need a senior developer who:
   - Has excellent React experience
   - Can lead a small team
   - Knows AWS and cloud platforms
   - Manchester based, hybrid working OK
   ```

2. Click **"Generate with AI ✨"**
3. Wait 2 seconds for AI to generate professional description
4. Review the generated text

### Step 4: Save Your Draft
- Click **"Save Draft"** in the top right
- Your job is saved to localStorage
- You're redirected to the edit page (when implemented)

---

## 📋 Managing Drafts

### Viewing Your Drafts
1. Navigate to `/jobforge/drafts`
2. See all your saved jobs in a grid layout

### Each Draft Card Shows:
- Job title and status
- Industry, location, salary
- Validation status (8/10 required fields)
- Quality score (87%)
- Last edited time

### Actions You Can Take:
- **Continue Editing**: Opens the job in the composer
- **Delete**: Removes the draft (with confirmation)
- **View Details**: Click the title to see more

---

## 🎯 Understanding the Dashboard

### Stats Overview
The dashboard shows 4 key metrics:
1. **Jobs Created**: Total jobs you've created
2. **My Drafts**: Current number of drafts
3. **Awaiting Approval**: Jobs pending manager review
4. **This Week**: Jobs created in the last 7 days

### Recent Activity
- Shows your last 5 jobs
- Displays status, location, and salary
- Quick edit access

### Quick Actions
Three shortcut buttons for common tasks:
- Clone Last Job
- Use Template
- Import from Email

---

## 💾 How Data is Stored

### LocalStorage
- All jobs saved to `jobforge_jobs` key
- Persists across browser sessions
- Can be inspected in DevTools

### Viewing Your Data
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Look for `jobforge_jobs`
4. See JSON array of all jobs

### Clearing Data
```javascript
// In browser console:
localStorage.removeItem('jobforge_jobs');
```

---

## 🎨 UI Features

### Status Badges
Jobs display color-coded status:
- **Gray**: Draft
- **Amber**: Pending Approval
- **Green**: Approved
- **Red**: Rejected
- **Blue**: In CRM

### Quality Indicators
- **Clarity**: How clear the job description is
- **Readability**: How easy it is to read
- **Completeness**: How complete the information is
- **Bias**: Detection of biased language
- **Overall Score**: Combined quality metric

### Validation Indicators
- ✓ **Green**: Field is valid
- ⚠ **Amber**: Warning or suggestion
- ✗ **Red**: Error or required field missing
- – **Gray**: Empty optional field

---

## 🔧 Troubleshooting

### Dashboard Shows No Stats
- **Issue**: Fresh install with no data
- **Solution**: Create your first job to populate stats

### Draft Not Saving
- **Check**: Browser localStorage is enabled
- **Check**: No browser extensions blocking storage
- **Try**: Refresh the page and try again

### AI Generation Not Working
- **Expected**: 2-second delay is intentional
- **Check**: Notes field is not empty
- **Note**: This is simulated AI, not real generation yet

### Navigation Badge Not Updating
- **Solution**: Refresh the page
- **Note**: Stats update on page load, not real-time yet

---

## 🎯 Best Practices

### Creating Quality Jobs
1. **Be Specific**: Provide detailed notes for AI
2. **Use Templates**: Start with proven templates
3. **Review Generated Content**: Always review AI output
4. **Complete Required Fields**: Ensure all validations pass

### Organizing Drafts
- **Save Often**: Use auto-save by updating draft
- **Use Descriptive Titles**: Make jobs easy to find
- **Delete Old Drafts**: Keep your list clean
- **Complete Jobs**: Don't leave too many incomplete

---

## 📚 Reference

### Keyboard Shortcuts (Future)
```
Ctrl/Cmd + N  - New Job
Ctrl/Cmd + S  - Save Draft
Ctrl/Cmd + /  - Search
```

### Common Workflows

**Quick Job Creation** (2 minutes):
1. Click "Create New Job"
2. Fill title, industry, location
3. Enter notes
4. Generate with AI
5. Save draft

**From Template** (1 minute):
1. Navigate to Templates
2. Select template
3. Customize fields
4. Save draft

**Bulk Editing** (Future):
1. Select multiple drafts
2. Apply bulk actions
3. Save changes

---

## 🚀 What's Next?

### Coming Soon
- **Edit Functionality**: Edit existing drafts
- **Templates**: Pre-built job templates
- **Approval Workflow**: Submit to managers
- **CRM Integration**: Push jobs to your CRM
- **Share Options**: Export to PDF, generate links
- **Advanced AI**: More sophisticated generation

### In Development
- Real-time collaboration
- Version control
- Advanced analytics
- Team management
- Custom branding

---

## 💡 Tips & Tricks

### Maximize AI Generation
- Provide detailed, specific notes
- Include key requirements
- Mention company culture
- Specify technical skills

### Speed Up Creation
- Use consistent field values
- Create personal templates
- Clone similar jobs
- Use keyboard shortcuts

### Maintain Quality
- Review all AI-generated content
- Check for bias in language
- Ensure salary ranges are accurate
- Validate all required fields

---

## 🆘 Need Help?

### Documentation
- Full UI/UX design: `/docs/jobforge-uiux-design.md`
- Workflows: `/docs/jobforge-workflows.md`
- Implementation: `/docs/jobforge-implementation-summary.md`

### Support
- Check documentation first
- Review error messages
- Clear browser cache if issues persist
- Contact your administrator

---

## ✅ Quick Checklist

Before creating your first job, ensure:
- [ ] You can access `/jobforge` in your browser
- [ ] Dashboard loads with stats (may show 0 initially)
- [ ] "Create New Job" button works
- [ ] Form fields are responsive
- [ ] AI generation button is visible
- [ ] Save Draft creates a new draft
- [ ] Drafts page shows your saved jobs

---

**You're all set!** Start creating professional job specifications with AI assistance. 🎉
