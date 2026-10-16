/* HOMELUXE demo data — all listings, agents and articles below are DEMO content
   created for this preview. Contact details and statistics are placeholders. */
(function () {
  function u(id, w, h) {
    var q = 'auto=format&fit=crop&w=' + (w || 1200) + '&q=80';
    if (h) q += '&h=' + h;
    return 'https://images.unsplash.com/photo-' + id + '?' + q;
  }
  window.HL_IMG = u;

  var IMG = {
    hero: u('1512917774080-9991f1c4c750', 1920, 1080),
    ext1: u('1600585154340-be6161a56a0c', 1200, 800),
    ext2: u('1568605114967-8130f3a36994', 1200, 800),
    ext3: u('1564013799919-ab600027ffc6', 1200, 800),
    ext4: u('1489171078254-c3365d6e359f', 1200, 800),
    int1: u('1613977257363-707ba9348227', 1200, 800),
    int2: u('1493809842364-78817add7ffb', 1200, 800),
    int3: u('1560448204-e02f11c3d0e2', 1200, 800),
    int4: u('1554995207-c18c203602cb', 1200, 800),
    int5: u('1556228453-efd6c1ff04f6', 1200, 800),
    int6: u('1600047509807-ba8f99d2cdde', 1200, 800),
    office: u('1486406146926-c627a92ad1ab', 1200, 800)
  };
  window.HL_IMAGES = IMG;

  window.HL_PROPERTIES = [
    {
      slug: 'modern-luxury-villa',
      title: 'Modern Luxury Villa',
      transaction: 'sale',
      price: 850000,
      address: '123 Maple Drive',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      type: 'Villa',
      beds: 4, baths: 3, sqft: 2450,
      lot: '0.42 acres', year: 2021,
      featured: true, createdAt: '2024-11-02',
      agent: 'sarah-mitchell',
      description: 'A striking contemporary villa with clean lines, floor-to-ceiling glass and an open-plan layout designed for effortless entertaining. The resort-style backyard features a heated pool, mature landscaping and a covered terrace for year-round outdoor living.',
      features: ['Heated saltwater pool', 'Smart home automation', 'Floor-to-ceiling windows', 'Chef\'s kitchen with island', 'Covered outdoor terrace', '3-car garage'],
      amenities: ['Central air conditioning', 'Energy Star appliances', 'Hardwood flooring', 'Home office', 'Walk-in closets', 'Security system', 'EV charging ready', 'Landscaped garden'],
      images: [IMG.ext3, IMG.int1, IMG.int2]
    },
    {
      slug: 'contemporary-family-home',
      title: 'Contemporary Family Home',
      transaction: 'sale',
      price: 620000,
      address: '456 Oak Avenue',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      type: 'House',
      beds: 3, baths: 2, sqft: 1890,
      lot: '0.28 acres', year: 2019,
      featured: true, createdAt: '2024-11-18',
      agent: 'david-chen',
      description: 'Bright, airy and built for modern family life, this home pairs a welcoming great room with a designer kitchen and a private fenced yard. Located minutes from top-rated schools, parks and downtown Austin.',
      features: ['Open-plan great room', 'Quartz kitchen counters', 'Fenced backyard', 'Primary suite with walk-in closet', 'Mudroom entry', 'Tankless water heater'],
      amenities: ['Central heating & cooling', 'Stainless appliances', 'Laundry room', 'Patio', 'Attic storage', 'Smart thermostat', 'Fresh interior paint', 'Two-car garage'],
      images: [IMG.ext1, IMG.int3, IMG.int5]
    },
    {
      slug: 'premium-urban-apartment',
      title: 'Premium Urban Apartment',
      transaction: 'rent',
      price: 3200,
      address: '789 Pine Street, Unit 5B',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      type: 'Apartment',
      beds: 2, baths: 2, sqft: 1200,
      lot: '—', year: 2022,
      featured: true, createdAt: '2024-12-01',
      agent: 'emily-rodriguez',
      description: 'Sleek corner apartment on the fifth floor with skyline views, wraparound windows and a finished interior in a full-service building. Steps from the waterfront promenade, dining and transit.',
      features: ['Skyline corner views', 'In-unit washer & dryer', 'Building gym access', '24/7 concierge', 'Balcony', 'Assigned parking space'],
      amenities: ['Rooftop pool', 'Fitness center', 'Package room', 'Pet friendly', 'Elevator', 'Bike storage', 'Central A/C', 'Wi-Fi ready'],
      images: [IMG.int4, IMG.int6, IMG.int3]
    },
    {
      slug: 'waterfront-luxury-villa',
      title: 'Waterfront Luxury Villa',
      transaction: 'sale',
      price: 1250000,
      address: '321 Ocean View Drive',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      type: 'Villa',
      beds: 2, baths: 4, sqft: 3100,
      lot: '0.55 acres', year: 2020,
      featured: true, createdAt: '2024-12-10',
      agent: 'james-okafor',
      description: 'A rare waterfront statement residence with unobstructed ocean views from nearly every room. Expansive terraces, a private dock access path and an infinity-edge pool complete the coastal luxury experience.',
      features: ['Infinity-edge pool', 'Panoramic ocean views', 'Private dock access path', 'Two-story glass atrium', 'Outdoor kitchen', 'Wine cellar'],
      amenities: ['Solar panel array', 'Radiant floor heating', 'Gated entry', 'Guest suite', 'Outdoor shower', 'Hurricane-rated glass', 'Smart lighting', '3-car garage'],
      images: [IMG.ext4, IMG.int2, IMG.int1]
    },
    {
      slug: 'hillside-modern-estate',
      title: 'Hillside Modern Estate',
      transaction: 'sale',
      price: 1150000,
      address: '88 Skyline Terrace',
      city: 'Scottsdale',
      state: 'AZ',
      zip: '85251',
      type: 'House',
      beds: 5, baths: 4, sqft: 3800,
      lot: '0.9 acres', year: 2018,
      featured: false, createdAt: '2024-10-20',
      agent: 'james-okafor',
      description: 'Perched on a private hillside lot, this architectural estate frames desert and city-light views through walls of glass. A dramatic great room, casita and negative-edge pool make it a one-of-a-kind retreat.',
      features: ['Negative-edge pool', 'Detached guest casita', 'Desert & city-light views', 'Great room with fireplace', 'Oversized covered patio', 'Private driveway'],
      amenities: ['Central A/C & heating', 'Owned solar', 'Home theater', 'Wet bar', 'Walk-in pantry', 'Synthetic putting green', 'Smart security', 'Four-car garage'],
      images: [IMG.ext2, IMG.int5, IMG.int2]
    },
    {
      slug: 'downtown-loft-apartment',
      title: 'Downtown Loft Apartment',
      transaction: 'rent',
      price: 2450,
      address: '1500 Main Street, Unit 12A',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      type: 'Apartment',
      beds: 1, baths: 1, sqft: 920,
      lot: '—', year: 2017,
      featured: false, createdAt: '2024-11-25',
      agent: 'emily-rodriguez',
      description: 'Converted warehouse loft with 14-foot ceilings, exposed brick and original timber beams. Polished concrete floors and a wall of north-facing windows keep the space bright all day.',
      features: ['14-foot ceilings', 'Exposed brick & timber', 'Mezzanine sleeping loft', 'Stainless kitchen', 'City views', 'Storage unit included'],
      amenities: ['In-unit laundry', 'Secure entry', 'Bike room', 'Rooftop deck', 'Fitness center', 'Pet friendly', 'Elevator', 'Fiber internet ready'],
      images: [IMG.int6, IMG.int4, IMG.int3]
    },
    {
      slug: 'classic-brownstone-townhouse',
      title: 'Classic Brownstone Townhouse',
      transaction: 'sale',
      price: 985000,
      address: '74 Chestnut Row',
      city: 'Boston',
      state: 'MA',
      zip: '02116',
      type: 'Townhouse',
      beds: 4, baths: 3, sqft: 2860,
      lot: '0.11 acres', year: 1908,
      featured: false, createdAt: '2024-09-30',
      agent: 'sarah-mitchell',
      description: 'A meticulously restored brownstone retaining original millwork, pocket doors and three working fireplaces, thoughtfully updated with modern systems, a chef\'s kitchen and a private garden patio.',
      features: ['Original millwork', 'Three fireplaces', 'Private garden patio', 'Renovated chef\'s kitchen', 'Finished lower level', 'Bay windows'],
      amenities: ['Central heating', 'Central A/C (updated)', 'Smart locks', 'Wine storage', 'Home office nook', 'Laundry chute', 'Intercom system', 'Rooftop access'],
      images: [IMG.ext1, IMG.int1, IMG.int5]
    },
    {
      slug: 'sunlit-bayfront-condo',
      title: 'Sunlit Bayfront Condo',
      transaction: 'rent',
      price: 4100,
      address: '220 Bayfront Lane, Unit 1802',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      type: 'Condo',
      beds: 2, baths: 2, sqft: 1350,
      lot: '—', year: 2020,
      featured: false, createdAt: '2024-12-14',
      agent: 'david-chen',
      description: 'Eighteenth-floor corner condo with sweeping bay and mountain views, a wide balcony and premium finishes throughout. Full-service building with concierge, spa and resident lounge.',
      features: ['Bay & mountain views', 'Wide private balcony', 'Floor-to-ceiling glass', 'Gas fireplace', 'Spa-like primary bath', 'Two parking stalls'],
      amenities: ['Concierge service', 'Resident spa', 'Fitness center', 'Club lounge', 'Guest suites', 'Pet friendly', 'EV parking', 'Secure storage'],
      images: [IMG.int2, IMG.int1, IMG.int6]
    },
    {
      slug: 'desert-oasis-villa',
      title: 'Desert Oasis Villa',
      transaction: 'sale',
      price: 2400000,
      address: '12 Vista del Sol',
      city: 'Palm Springs',
      state: 'CA',
      zip: '92262',
      type: 'Villa',
      beds: 5, baths: 6, sqft: 4900,
      lot: '1.2 acres', year: 2023,
      featured: false, createdAt: '2024-12-20',
      agent: 'james-okafor',
      description: 'A newly completed desert masterpiece organized around a central courtyard, with a lap pool, outdoor cinema wall and panoramic mountain views. Inside, warm minimalism meets museum-quality finishes.',
      features: ['Lap pool & spa', 'Outdoor cinema wall', 'Central courtyard', 'Poolside casita', 'Fold-away glass walls', 'Chef\'s prep kitchen'],
      amenities: ['Fully furnished option', 'Solar + battery backup', 'Smart home throughout', 'Desert landscaping', 'Fire features', 'Gated 1.2-acre lot', 'Air-conditioned garage', 'Wellness suite'],
      images: [IMG.ext3, IMG.int5, IMG.int1]
    },
    {
      slug: 'garden-view-family-home',
      title: 'Garden View Family Home',
      transaction: 'rent',
      price: 3800,
      address: '415 Willow Bend Road',
      city: 'Portland',
      state: 'OR',
      zip: '97205',
      type: 'House',
      beds: 4, baths: 3, sqft: 2400,
      lot: '0.3 acres', year: 2015,
      featured: false, createdAt: '2024-11-08',
      agent: 'emily-rodriguez',
      description: 'Craftsman-inspired rental with a deep porch, light-filled living spaces and a fully fenced garden with raised beds and a play lawn. Close to trails, schools and the neighborhood village.',
      features: ['Covered front porch', 'Fenced garden & raised beds', 'Family room with fireplace', 'Double vanity primary bath', 'Alley-access garage', 'Rain barrels'],
      amenities: ['Central heating', 'Ductless A/C', 'Washer & dryer included', 'Play structure', 'Garden shed', 'Pet friendly', 'Quiet street', 'Storage attic'],
      images: [IMG.ext2, IMG.int3, IMG.int4]
    }
  ];

  window.HL_AGENTS = [
    {
      id: 'sarah-mitchell',
      name: 'Sarah Mitchell',
      role: 'Principal Broker',
      photo: u('1573496359142-b8d87734a5a2', 600, 600),
      phone: '(800) 123-4567 ext. 101',
      email: 'sarah.mitchell@homeluxe.demo',
      specialties: ['Luxury Homes', 'Historic Properties', 'Relocation'],
      bio: 'Sarah has guided hundreds of buyers and sellers through seamless transactions, with a specialty in architectural and historic homes.'
    },
    {
      id: 'david-chen',
      name: 'David Chen',
      role: 'Senior Listing Agent',
      photo: u('1560250097-0b93528c311a', 600, 600),
      phone: '(800) 123-4567 ext. 102',
      email: 'david.chen@homeluxe.demo',
      specialties: ['Listing Strategy', 'New Construction', 'Investment'],
      bio: 'David builds data-driven listing strategies that position homes to sell faster and at stronger prices in competitive markets.'
    },
    {
      id: 'emily-rodriguez',
      name: 'Emily Rodriguez',
      role: 'Buyer & Rental Specialist',
      photo: u('1544005313-94ddf0286df2', 600, 600),
      phone: '(800) 123-4567 ext. 103',
      email: 'emily.rodriguez@homeluxe.demo',
      specialties: ['First-Time Buyers', 'Rentals', 'Urban Living'],
      bio: 'Emily is known for patient, consultative service — matching first-time buyers and renters with homes that fit their lives and budgets.'
    },
    {
      id: 'james-okafor',
      name: 'James Okafor',
      role: 'Luxury Property Advisor',
      photo: u('1507003211169-0a1dd7228f2d', 600, 600),
      phone: '(800) 123-4567 ext. 104',
      email: 'james.okafor@homeluxe.demo',
      specialties: ['Estates & Villas', 'Waterfront', 'Global Buyers'],
      bio: 'James advises high-net-worth clients on signature estates, waterfront residences and discreet off-market opportunities.'
    }
  ];

  window.HL_POSTS = [
    {
      slug: 'questions-before-buying-first-home',
      title: '5 Questions to Ask Before Buying Your First Home',
      category: 'Buying',
      date: '2024-11-12', minutes: 5,
      cover: IMG.int6,
      excerpt: 'Before you fall in love with a listing, make sure you can answer these five questions about your budget, timeline and long-term plans.',
      content: [
        'Buying your first home is exciting, but the best outcomes start with honest preparation. Before touring properties, sit down and answer a few foundational questions about what you truly need — not just what looks beautiful in photos.',
        'First, know your real budget. A lender may approve you for more than you can comfortably spend once taxes, insurance, maintenance and utilities are included. Build your target range around a monthly payment you could sustain even if costs rise modestly.',
        'Second, decide how long you plan to stay. Transaction costs mean buying generally rewards owners who remain in place for several years. If your plans are uncertain, factor flexibility into the type of property and financing you choose.',
        'Third, separate needs from wants. Parking, commute times, school districts and the number of bedrooms are structural. Finishes, fixtures and paint colors are changeable. Prioritize the structure.',
        'Fourth, get pre-approved before house hunting. A pre-approval letter signals to sellers that you are a serious buyer and gives you a reliable ceiling for offers.',
        'Finally, ask what the neighborhood will be like on a rainy Tuesday, not a sunny open-house Sunday. Visit at different times, check noise and traffic, and picture your daily routine in the space. The right answer to these five questions makes everything that follows far easier.'
      ]
    },
    {
      slug: 'how-to-stage-your-home',
      title: 'How to Stage Your Home for a Faster Sale',
      category: 'Selling',
      date: '2024-11-05', minutes: 6,
      cover: IMG.int5,
      excerpt: 'Small, low-cost staging decisions consistently help listings feel brighter, larger and more inviting. Here is a practical checklist.',
      content: [
        'Staging is not about decorating — it is about helping buyers picture themselves living in the space. That means decluttering, depersonalizing and arranging each room around a single clear purpose.',
        'Start with light. Replace dim bulbs with warm, daylight-temperature LEDs, open every curtain, and trim overgrown shrubs that block windows. Bright rooms photograph better and feel larger in person.',
        'Next, edit ruthlessly. Remove at least a third of personal items from shelves and counters. Clear magnets and photos from the refrigerator. Buyers should see the home, not your routine.',
        'Give every room one obvious function. A dining table with chairs and a simple centerpiece tells a clearer story than a table buried under a laptop, mail and gym bags.',
        'Pay special attention to the two rooms that sell homes: the kitchen and the primary bathroom. Deep-clean grout, clear counters, and stage the bathroom like a boutique hotel — white towels, clear surfaces.',
        'Finally, invest in professional photography. Well-lit, wide-angle photos are the first showing; most buyers decide whether to visit based on the images they scroll past in seconds.'
      ]
    },
    {
      slug: 'mortgage-rates-explained',
      title: 'Mortgage Rates, Simply Explained',
      category: 'Financing',
      date: '2024-10-28', minutes: 4,
      cover: IMG.office,
      excerpt: 'Rates, points, terms and APR are often confused. A plain-language guide to what each number means for your monthly payment.',
      content: [
        'A mortgage rate is the price of borrowing money, expressed as a yearly percentage of your loan balance. Even a fraction of a percent changes your monthly payment and the total interest you pay over the life of the loan.',
        'The rate you are offered depends on your credit profile, down payment, loan type and broader market conditions. No one can promise you a specific rate in an article — your personalized offer comes from a licensed lender after reviewing your application.',
        'Points are upfront fees paid to reduce your rate. One point equals one percent of the loan amount. Paying points only pays off if you keep the loan long enough for the monthly savings to exceed the upfront cost.',
        'APR bundles the interest rate with certain fees, which makes it useful for comparing offers on equal terms — but it is not the same as your monthly payment.',
        'Loan term matters as much as rate. A shorter term usually carries a lower rate and far less total interest, but higher monthly payments. Use a mortgage calculator to see how term and rate interact before choosing.',
        'This article is general educational information, not financial advice. For guidance on your specific situation, speak with a licensed mortgage professional.'
      ]
    },
    {
      slug: 'renting-vs-buying',
      title: 'Renting vs. Buying: Which Is Right for You?',
      category: 'Renting',
      date: '2024-10-15', minutes: 5,
      cover: IMG.int4,
      excerpt: 'The classic question deserves a modern answer — one that starts with flexibility, total monthly costs and your local market.',
      content: [
        'The renting-versus-buying debate is often framed as a battle between throwing money away and building equity. The honest answer is more nuanced: the right choice depends on your timeline, finances and local market.',
        'Renting shines when flexibility matters. Leases are short commitments; repairs are usually the owner\'s responsibility; and moving for a career or family change is dramatically simpler.',
        'Buying rewards stability. Over time, part of each mortgage payment builds equity, and fixed-rate loans lock in your biggest housing cost while rents may keep rising. But ownership also brings property taxes, insurance, maintenance and transaction costs.',
        'A practical rule of thumb: if you expect to stay in one place for at least four to five years and have savings for a down payment plus an emergency fund, buying deserves serious consideration.',
        'Compare the real numbers side by side — including every monthly cost, not just rent versus principal and interest. For a quick estimate of ownership costs, try our mortgage calculator, and remember that estimates are a starting point, not a promise.'
      ]
    },
    {
      slug: 'online-house-hunting-guide',
      title: 'The Smart Way to House Hunt Online',
      category: 'Guides',
      date: '2024-09-30', minutes: 4,
      cover: IMG.int2,
      excerpt: 'Filters, alerts and virtual tours can save you dozens of wasted viewings — if you use them with a plan.',
      content: [
        'Online listings give today\'s buyers a powerful head start — but only with a disciplined approach. Start by defining your non-negotiables before you open a single search result.',
        'Use filters honestly. Setting a budget ceiling slightly below your true maximum gives you room to compete, while over-filtering on cosmetic preferences hides homes with outstanding potential.',
        'Save searches with alerts. Good matches appear and disappear within days; instant notifications mean you see fresh listings the morning they publish.',
        'Read between the photos. Wide-angle lenses stretch rooms; look at window views and ceiling lines for true scale, and check the listing\'s date and price history for signals about seller motivation.',
        'Take virtual tours seriously, then verify in person. A video walkthrough can rule a home in or out efficiently, but never buy without walking the space, the block and the commute yourself.'
      ]
    },
    {
      slug: 'what-adds-value-to-your-property',
      title: 'What Really Adds Value to Your Property?',
      category: 'Investing',
      date: '2024-09-18', minutes: 6,
      cover: IMG.int3,
      excerpt: 'Not every renovation pays for itself. Which improvements tend to hold their value, and which rarely return the cost.',
      content: [
        'Before spending on a major renovation, it helps to know which projects tend to return value at resale and which mostly return enjoyment. The two are both valid — but they should be decided on purpose.',
        'Kitchens and bathrooms remain the strongest performers, though full remodels rarely return one hundred percent of their cost. Focused refreshes — fixtures, hardware, lighting, paint — often outperform gut renovations dollar for dollar.',
        'Curb appeal is quiet ROI. A tidy lawn, trimmed shrubs, a clean entry and a painted front door are among the cheapest improvements with the most immediate visual effect.',
        'Adding usable square footage — a legal bedroom, a finished basement that meets code, a permitted deck — tends to add real value when it aligns with what buyers in your area expect.',
        'Be cautious with highly personal choices: elaborate landscaping, niche rooms and luxury fittings that outpace the neighborhood rarely return their cost at sale.',
        'Every market is different, so before renovating with resale in mind, ask a local agent which improvements buyers in your specific area actually reward.'
      ]
    }
  ];
})();
