
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

export function AboutSection() {
  const goals = [
    "Systematically expand our reach to cover all villages in a phased manner.",
    "Ensure 100% of donations go directly to beneficiaries with full transparency.",
    "Empower local village admins to identify and verify genuine cases of need.",
    "Foster a reliable monthly donation cycle for consistent and predictable support.",
  ];

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card id="our-mission">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To build a transparent and trusted bridge between generous donors and verified families in need. We aim to provide timely and direct monthly aid, empowering local communities and ensuring that 100% of every contribution reaches those who need it most.
          </p>
        </CardContent>
      </Card>
      <Card id="our-goals">
        <CardHeader>
          <CardTitle>Our Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckSquare className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">{goal}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
