import { Features } from './Features';
import { About } from './About';
import { Menu } from './Menu';
import { Testimonial } from './Testimonial';
import { ExampleDish } from './ExampleDish';
import { Bartender } from './Bartender';

export const Body = () => {
  return (
    <main className="bg-yellow-100">
      <Features />
      <About />
      <Menu />
      <Testimonial />
      <ExampleDish />
      <Bartender />
    </main>
  );
};