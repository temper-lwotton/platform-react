'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/primitives/Card';
import { Button } from '@/components/ui/primitives/Button/Button';
import styles from './showcase.module.scss';

export default function GlassShowcasePage() {
  return (
    <div className={styles.showcase}>
      <div className={styles.header}>
        <h1 className={styles.title}>Liquid Glass Showcase</h1>
        <p className={styles.subtitle}>
          Apple-inspired glassmorphism design system with backdrop blur, depth, and luminous effects
        </p>
      </div>

      <div className={styles.grid}>
        {/* Card Variants Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Card Variants</h2>

          <div className={styles.cardGrid}>
            <Card variant="glass">
              <CardHeader>
                <h3>Glass Card</h3>
              </CardHeader>
              <CardContent>
                <p>Basic glass effect with backdrop blur and translucent background.</p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>12.5K</span>
                    <span className={styles.statLabel}>Members</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>89%</span>
                    <span className={styles.statLabel}>Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glassElevated">
              <CardHeader>
                <h3>Glass Elevated</h3>
              </CardHeader>
              <CardContent>
                <p>Enhanced glass with inner highlight for more depth and premium feel.</p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>3.2K</span>
                    <span className={styles.statLabel}>Posts</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>42</span>
                    <span className={styles.statLabel}>Events</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glassAnimated">
              <CardHeader>
                <h3>Glass Animated</h3>
              </CardHeader>
              <CardContent>
                <p>Interactive glass with smooth hover animations and blur transitions.</p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>156</span>
                    <span className={styles.statLabel}>Tasks</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>24h</span>
                    <span className={styles.statLabel}>Avg Time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Button Variants</h2>

          <div className={styles.buttonGrid}>
            <div className={styles.buttonDemo}>
              <Button variant="glass" size="lg">Glass Button</Button>
              <p className={styles.demoLabel}>Standard glass button</p>
            </div>

            <div className={styles.buttonDemo}>
              <Button variant="glassPrimary" size="lg">Glass Primary</Button>
              <p className={styles.demoLabel}>Glass with primary accent</p>
            </div>

            <div className={styles.buttonDemo}>
              <Button variant="glass" size="md">Medium Size</Button>
              <p className={styles.demoLabel}>Medium glass button</p>
            </div>

            <div className={styles.buttonDemo}>
              <Button variant="glassPrimary" size="sm">Small Size</Button>
              <p className={styles.demoLabel}>Small glass button</p>
            </div>
          </div>
        </section>

        {/* Layered Glass Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Layered Depth</h2>

          <div className={styles.layeredDemo}>
            <Card variant="glass" className={styles.layer1}>
              <CardContent>
                <h3>Layer 1 - Background</h3>
                <p>This demonstrates how glass elements can stack to create depth perception.</p>
              </CardContent>
            </Card>

            <Card variant="glassElevated" className={styles.layer2}>
              <CardContent>
                <h3>Layer 2 - Middle</h3>
                <p>Each layer has different blur and opacity values.</p>
              </CardContent>
            </Card>

            <Card variant="glassAnimated" className={styles.layer3}>
              <CardContent>
                <h3>Layer 3 - Foreground</h3>
                <p>Hover to see the interactive animation.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Showcase */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactive Elements</h2>

          <Card variant="glass" className={styles.fullWidth}>
            <CardContent>
              <div className={styles.interactiveGrid}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🌊</div>
                  <h4>Backdrop Blur</h4>
                  <p>CSS backdrop-filter creates the frosted glass effect</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>✨</div>
                  <h4>Luminous Glows</h4>
                  <p>Subtle shadows and glows add depth and interactivity</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🎨</div>
                  <h4>Theme Aware</h4>
                  <p>Automatically adapts to light and dark modes</p>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>⚡</div>
                  <h4>Smooth Animations</h4>
                  <p>Spring-based cubic-bezier transitions</p>
                </div>
              </div>

              <div className={styles.actions}>
                <Button variant="glassPrimary">Try it now</Button>
                <Button variant="glass">Learn more</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Showcase */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Glass with Color Accents</h2>

          <div className={styles.colorGrid}>
            <Card variant="glass" className={styles.accentBlue}>
              <CardContent>
                <h4>Blue Accent</h4>
                <p>Glass combined with blue glow effects</p>
                <Button variant="glassPrimary" size="sm">Action</Button>
              </CardContent>
            </Card>

            <Card variant="glass" className={styles.accentGreen}>
              <CardContent>
                <h4>Green Accent</h4>
                <p>Glass with neon green highlights</p>
                <Button variant="glass" size="sm">Action</Button>
              </CardContent>
            </Card>

            <Card variant="glass" className={styles.accentPurple}>
              <CardContent>
                <h4>Purple Accent</h4>
                <p>Glass with purple gradient tints</p>
                <Button variant="glass" size="sm">Action</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
