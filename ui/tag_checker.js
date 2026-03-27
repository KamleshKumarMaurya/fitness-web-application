import fs from 'fs';

const content = fs.readFileSync('d:/Project-2027/Fitness-App/ui/src/app/dashboard/dashboard.component.ts', 'utf8');
const templateMatch = content.match(/template: `([\s\S]*?)`,/);
if (!templateMatch) {
  console.log('Template not found');
  process.exit(1);
}
const template = templateMatch[1];

const stack = [];
const tagRegex = /<(\/?[a-z0-9-]+)[^>]*>/gi;
let match;
let line = 1;

while ((match = tagRegex.exec(template)) !== null) {
  const tagName = match[1].toLowerCase();
  const isClosing = tagName.startsWith('/');
  const tag = isClosing ? tagName.slice(1) : tagName;
  
  // self-closing or lucide-angular tags might be problematic if not closed
  if (tagName === 'lucide-angular' || tagName === 'img' || tagName === 'br' || tagName === 'hr' || tagName === 'input') {
     // many of these are self-closing or used as such in some contexts
     // but in Angular template, lucide-angular is usually closed
  }

  if (isClosing) {
    if (stack.length === 0) {
      console.log(`Unexpected closing tag </${tag}>`);
    } else {
      const last = stack.pop();
      if (last !== tag) {
        console.log(`Mismatched closing tag </${tag}> (expected </${last}>)`);
      }
    }
  } else {
    // skip self-closing tags
    if (!match[0].endsWith('/>') && !['br', 'hr', 'img', 'input'].includes(tag)) {
        stack.push(tag);
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed tags:', stack.join(', '));
} else {
  console.log('Tags are balanced');
}
