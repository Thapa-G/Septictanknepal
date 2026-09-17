<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\CompanyDetail;
use App\Models\ContactMessage;
use App\Models\Service;
use App\Models\ServiceFaq;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@drainexpert.com'],
            [
                'name' => 'Drain Expert Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Company Details
        CompanyDetail::updateOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Septic-Tank Nepal',
                'logo_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHSvU_e-OY9_Qd45lxkymEknXP2jzdiMzAubiDoTslHDW_2E0DePnJ09YidT_NNYZUoHuKe9WQE-2L55UKSCv3EkEFU7Xo2_6RlLhSdUWwCBAs_1t5CC-pOxxGXqDxo9W6J9y6TkV1hhOxzkkZEywcklF4PunuLlemx4LGZ8xoXFoYQNJv2aIJus15_bhVbq3_AQee7arxy3RIxmzA3wkqK6HhUqeplN_BjguwfATZoED_l_N_Zd7w',
                'whatsapp_number' => '9841169351',
                'emergency_phone' => '+977 9841169351',
                'email' => 'nepalseptictank@gmail.com',
                'address' => 'Kathmandu, Bagmati Province, Nepal',
                'latitude' => 27.7172000,
                'longitude' => 85.3240000,
                'operating_hours' => '4:00 AM – 9:00 PM, 365 days a year',
            ]
        );

        // 3. Services & FAQs
        $services = [
            [
                'title' => 'Drain & Pipe Cleaning',
                'slug' => 'drain-pipe-cleaning',
                'category' => 'Drain Cleaning',
                'short_description' => 'Advanced mechanical and chemical solutions to clear stubborn blockages in residential and commercial drainage systems, restoring optimal flow quickly and safely.',
                'full_description' => "Our professional drain & pipe cleaning service utilizes state-of-the-art motorized drain snakes, root cutters, and high-velocity water jetting to eliminate even the most resilient blockages. 

### Why Choose Our Drain Cleaning?
- **Root Removal & Pipe Descaling**: Cleans pipe walls back to original diameter without harming plumbing materials.
- **Fast Emergency Response**: Quick dispatch across Kathmandu Valley.
- **Hygienic Workplace**: We leave your bathrooms, kitchens, and yards clean and sanitized after every operation.
- **Endoscopic Camera Inspection**: Visual proof of cleared lines before we finish.",
                'icon' => 'water_damage',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjluVn_75F2aC8zdzdrUADedD105FKqFeURRJoD13s-xwUsMKrOANHC0GJsXq3_I0uUTzt5TZ54X52_OFZGtmu-d5ir6GNkvSvWvWbW_5zJTVFEDK1MPlmauBcEYXgBaZOf2TtBzrFp6rad5hZXBqnyMNg-A3cCwEezyrnmVQyTg3uHWu5N8LGU9ShdZ25rC5veJnOMgUGy11z5zfSXjB8rBlKS_g137C3Ua7x-QJc_Qs_7TqzqDw',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'is_featured' => true,
                'order' => 1,
                'faqs' => [
                    [
                        'question' => 'How often should residential drains be professionally cleaned?',
                        'answer' => 'We recommend a thorough inspection and preventive cleaning every 1 to 2 years, or immediately if multiple fixtures start draining slowly.',
                    ],
                    [
                        'question' => 'Will chemical or motorized cleaning damage my pipes?',
                        'answer' => 'No. We use professional-grade mechanical tools and eco-safe hydro jetting methods tailored specifically to the type and condition of your pipes (PVC, Cast Iron, or Concrete).',
                    ],
                ],
            ],
            [
                'title' => 'Sewer Line Repair',
                'slug' => 'sewer-line-repair',
                'category' => 'Sewer Services',
                'short_description' => 'Comprehensive cleaning of main sewer lines using heavy-duty equipment to remove roots, grease, and debris, preventing major backups and system failures.',
                'full_description' => "Damaged or collapsed sewer lines can result in severe sewage backups, unpleasant odors, and property health risks. Septic-Tank Nepal provides comprehensive diagnosis, trenchless patching, and full replacement services.

### Key Capabilities:
- High-pressure main line scouring
- Trenchless pipe relining and spot repairs
- Heavy-duty root cutting blades
- Complete municipal connection inspection",
                'icon' => 'construction',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDnIFgME7XcwJByHGHPgWozAJdfLmIhxAfxfM4gDICLpQJFEOL14LQz6fWWp8IV_eb9AuwYsza7t4KtABD6aftG5-1bY1OxdvHAiCdxfi_fJn9nLwRiKKXDQzaB1lYlcw5rIhQ21SpFmFwGhfDtDtC0KF6DWF3WWPpG5a4kLe3JqnjA5AgbwExh3R0AH2xbM924jewjiWHcmXFS5hunZ9J7rqXNMkiCOh6b-UAsF2pWL55INU8Vpin',
                'video_url' => null,
                'is_featured' => true,
                'order' => 2,
                'faqs' => [
                    [
                        'question' => 'How do I know if my sewer line is broken vs just clogged?',
                        'answer' => 'Broken lines often show persistent sewage smell outdoors, soggy patches in your yard, or repeating backups even after plunging. Our camera inspection provides 100% definitive diagnosis.',
                    ],
                ],
            ],
            [
                'title' => 'Septic Tank Service & Pumping',
                'slug' => 'septic-tank-pumping',
                'category' => 'Septic Services',
                'short_description' => 'Professional vacuum truck services for the complete removal of solid and liquid waste from septic systems, ensuring environmental compliance and system longevity.',
                'full_description' => "Neglecting your septic tank can lead to severe backups, property damage, and environmental hazards. Regular pumping removes sludge buildup, ensuring proper drainage and extending the life of your entire system.

### Full Service Inclusions:
- High-powered suction vacuum trucks (multiple capacity sizes to access narrow Kathmandu alleys)
- High-pressure tank wall jetting to break up compacted bottom sludge
- Inlet and outlet baffle inspection
- Environmentally responsible waste treatment and certified disposal",
                'icon' => 'rv_hookup',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzMBvUxg6xMTV-tk2owptmrZgWlZgd_UqeasvpAFLTnRrgbHCkwTI7-R1eKL-FhHW3jfx4OO6yTK6R1i0G46ucDICOuiGbvygnHk5dL6yQqh7dBF4vRsvzqZ6O0dFhPq6tsPlYyn6qOwTkEvFsmUaKnaJD8DBxuApq1aNFEWeHuF2OtvOgWJ_TdV3y5mSgl7GWp99Y1ENQ-0-DwUFUw6gJVJYRnGHH8Fe6e2ykxYC2xmgSJX-tV7Gz',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'is_featured' => true,
                'order' => 3,
                'faqs' => [
                    [
                        'question' => 'Why hire professionals for Septic tank pumping and cleaning?',
                        'answer' => 'Professional technicians possess the specialized vacuum machinery and safety training required to handle toxic gases and biohazards. They guarantee environmentally responsible disposal preventing costly long-term damage.',
                    ],
                    [
                        'question' => 'How does the Septic Tank cleaning service work?',
                        'answer' => 'Our team uses high-powered vacuum trucks to extract all liquid and solid waste. We perform high-pressure wash to remove hardened sludge from the walls and floor, followed by baffle inspections.',
                    ],
                    [
                        'question' => 'How frequently does my septic tank need pumping?',
                        'answer' => 'For most residential systems in Nepal, we recommend professional pumping every 3 to 5 years depending on household size, water usage, and tank capacity.',
                    ],
                ],
            ],
            [
                'title' => 'Hydro Jetting Service',
                'slug' => 'hydro-jetting',
                'category' => 'High-Pressure Cleaning',
                'short_description' => 'State-of-the-art high-pressure water jetting technology designed to obliterate the toughest clogs, scale, and grease build-up in residential and commercial lines.',
                'full_description' => "Hydro jetting sends water pressurized up to 4000 PSI through specialized rotating nozzles. It slices through tree roots, dissolves solidified fats and grease, and washes away debris without requiring digging or pipe disassembly.",
                'icon' => 'waves',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI7cIdzb6CdTFXDBA04BFdeZZrpEzXyFAHxlQ66oFQUkEPT4dsseY5yQ7K9JsYv5X7rEXW52M-3cAOaovmqZdl7ZBO6oo51siovdphhhfQ2-NKzpiDJdxIoMX36lswBrpSsGL2Ey_HDHxeSqwthqQcg42sRu2KZyb9YQrVgHOkFPmOiS9eSG3HkpTcFbl4ur7qPZu1CFByM-oLDC6cdXUi9yhmZFHfseVtFezqSX2sFke4kC3Oy5Si',
                'video_url' => null,
                'is_featured' => true,
                'order' => 4,
                'faqs' => [
                    [
                        'question' => 'Is hydro jetting safe for older pipes?',
                        'answer' => 'Our technicians first conduct a camera inspection to assess pipe integrity and calibrate the water pressure safely for older clay or PVC pipes.',
                    ],
                ],
            ],
            [
                'title' => 'Toilet Unblocking',
                'slug' => 'toilet-unblocking',
                'category' => 'Emergency Plumbing',
                'short_description' => 'Rapid response service for severe toilet blockages, utilizing specialized augers to remove obstructions without damaging porcelain fixtures or plumbing.',
                'full_description' => "A clogged toilet can cause unsanitary overflows and severe disruptions. Our emergency plumbing technicians arrive equipped with specialized closet augers and vacuum devices to rapidly restore operation without scratching porcelain.",
                'icon' => 'wc',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWiyCop0ITeHN2CvShSzXnzicz9Q8-yCfBb3o8KHKq_NDxpICdZqMlfJjV-jO7FWpOp2exaDzY3G9rPPGald4k9gvlJjUcp6liN58iHPz4ul10SeBRlVcVqCqzjPnUwwZMQQiME83feZ8VurR-7Y3yuZGaEDOhqYDhbHvxQuIf9Og0TeWpbWngIA_6aQ75U8t8go3t7u57KezfByyxq8dWeFByK4_m_oK_mM4_O40RtbidWi6DzVE',
                'video_url' => null,
                'is_featured' => false,
                'order' => 5,
                'faqs' => [],
            ],
            [
                'title' => 'Water Tanks & Soak Pits',
                'slug' => 'water-tanks-soak-pits',
                'category' => 'Sanitation',
                'short_description' => 'Hygienic cleaning, de-sludging, and UV/chlorine disinfection of underground and overhead drinking water storage tanks and soak pits.',
                'full_description' => "Ensure clean, safe water for your family. We drain, de-sludge, scrub, high-pressure wash, and disinfect drinking water tanks using food-grade sanitizing solutions.",
                'icon' => 'water_drop',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAClq4gyDoGmW61JfvqV2NdlHodd6W32uJUTvLTBTNjQA9GYLcHFOPaIAmL5s7KDXWbyScia-ag3c-8rca9JlCBRwb3Kh8PiBgJgf1euCg9nQKWkUtaKsIFMcIxtVYm9J2tTr-3xYzoMRPjeDrAjne5S4IQTpTm-ZtrvWfLLWcXBygNIbaGvgG11UIGGbhO__WyKVa4M3nbU0JMiGRBDOyPneWeszrMUoKgP2B8Ms5nCh5yqC00qnvr',
                'video_url' => null,
                'is_featured' => false,
                'order' => 6,
                'faqs' => [],
            ],
        ];

        foreach ($services as $srvData) {
            $faqs = $srvData['faqs'] ?? [];
            unset($srvData['faqs']);

            $service = Service::updateOrCreate(['slug' => $srvData['slug']], $srvData);
            $service->faqs()->delete();

            foreach ($faqs as $i => $faq) {
                ServiceFaq::create([
                    'service_id' => $service->id,
                    'question' => $faq['question'],
                    'answer' => $faq['answer'],
                    'order' => $i,
                ]);
            }
        }

        // 4. Blogs
        $blogs = [
            [
                'title' => '5 Signs Your Septic Tank Needs Immediate Pumping',
                'slug' => '5-signs-your-septic-tank-needs-immediate-pumping',
                'category' => 'Emergency Tips',
                'author' => 'Admin',
                'excerpt' => "Don't wait for a backup. Learn the early warning signs of a full septic tank to avoid costly and messy plumbing disasters in your home or business.",
                'content' => "Maintaining a healthy septic system is crucial for the hygiene and functionality of your property. Ignoring the early warning signs can lead to catastrophic failures, resulting in costly repairs and unsanitary conditions. Here are the top five indicators that your septic tank requires immediate professional attention.

## 1. Slow Drains Across the House
If you notice that sinks, bathtubs, and toilets are draining significantly slower than usual, and plunging doesn't solve the issue, it's often a sign that your septic tank is reaching capacity. This widespread sluggishness indicates a systemic issue rather than a localized clog.

## 2. Unpleasant Odors
A functioning septic system should contain its odors. If you begin to smell sewage around your property, especially near the tank or the drain field, it's a strong indication that gases are escaping because the tank is full or failing.

## 3. Unusually Lush Grass
While a green lawn is generally desirable, patches of exceptionally lush, dark green grass over your septic drain field are a red flag. This happens when sewage liquid is rising to the surface, acting as an unintended fertilizer due to a failing system.

## 4. Sewage Backups
This is the most critical and unsanitary sign. If raw sewage begins backing up into your sinks, bathtubs, or toilets, you have an immediate emergency. Stop using water immediately and call a professional, as the system has completely failed to process waste.

## 5. Gurgling Sounds in Pipes
Listen to your plumbing. If you hear persistent gurgling sounds coming from your pipes when you run water or flush a toilet, it indicates that the system is struggling to vent properly, often because the tank is too full to allow air to escape normally.",
                'icon' => 'warning',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7uCIPYHm8EJZvPor5srfBzNextPUXCaos7r2pCTm3SiAdwvzp1ubpEjJyZ2XK6brPp9fvNP2A9-T1lVbucFsU7SYSPtm76PCDrspXJz-gm-dw6qpQ5h9DSlRVPXF3B8SxvUdUuwc4X4tp6nopGhp1Jarw5T6vsrBgA__6JOUQ_FfER5fN_MScHsxotURzXukGl0TRlWhmnDYtm4S6LmTIzBPW21jjlESHN80Oy0DGU1rwVcwo8Lhx',
                'is_featured' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'How to Prevent Clogged Drains This Monsoon',
                'slug' => 'how-to-prevent-clogged-drains-this-monsoon',
                'category' => 'Maintenance',
                'author' => 'Admin',
                'excerpt' => 'Simple, actionable steps to keep your drainage systems clear during the heavy rains in the Kathmandu Valley.',
                'content' => "Monsoon season in Kathmandu brings heavy rains that can overwhelm storm drains and push silt, leaves, and debris into domestic sewer lines.

### Top Monsoon Preparation Tips:
1. **Clean Gutter Strainers**: Inspect rooftop rainwater outlets and clear collected debris weekly.
2. **Install Silt Traps**: Ensure your outdoor courtyard drains have functional catch basins.
3. **Inspect Main Sewer Backflow Valves**: Prevent municipal sewer surges from pushing backward into ground-floor bathrooms during flash rains.
4. **Schedule Preventive Hydro Jetting**: Clearing minor build-ups before the heavy rains start guarantees smooth drainage all season.",
                'icon' => 'water_drop',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYuVZT2DynhdwpfW7IzexYgrslMyc6nPUghtckJiSwyMlfS8FIi0Z2G_TgSbFEv4kkk_2MldhzyHDQ01IoRY90LDGWL7gbrk2WT2D-VOtwG4W9vFrFKMiHTYIxx_yh1Gl9APLhsChYXfjP_I9OksTuYVc6ohff8tP1ckeyjqYEN87i4LSAa589cibKZBgRN-q7kVHQ1HFzPodpgu9PAvwExEq3vOtzfLI__7UKJra161o-kcWQuy3w',
                'is_featured' => false,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'DIY vs Professional Plumbing: When to Call the Experts',
                'slug' => 'diy-vs-professional-plumbing-when-to-call-the-experts',
                'category' => 'Maintenance',
                'author' => 'Admin',
                'excerpt' => 'Knowing when to tackle a fix yourself and when it requires a professional can save you time, money, and headaches.',
                'content' => "While simple tasks like clearing a bathroom sink hair trap or plunging a minor toilet block can be handled with basic home tools, deeper plumbing issues require specialized machinery.

Using harsh chemical drain cleaners can corrode pipes and release toxic fumes without dissolving tree roots or solid mineral calcification. When facing recurring blockages or whole-house backups, always trust certified technicians with motorized augers and high-pressure jetters.",
                'icon' => 'build',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjluVn_75F2aC8zdzdrUADedD105FKqFeURRJoD13s-xwUsMKrOANHC0GJsXq3_I0uUTzt5TZ54X52_OFZGtmu-d5ir6GNkvSvWvWbW_5zJTVFEDK1MPlmauBcEYXgBaZOf2TtBzrFp6rad5hZXBqnyMNg-A3cCwEezyrnmVQyTg3uHWu5N8LGU9ShdZ25rC5veJnOMgUGy11z5zfSXjB8rBlKS_g137C3Ua7x-QJc_Qs_7TqzqDw',
                'is_featured' => false,
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Expanded Service Areas in Lalitpur and Bhaktapur',
                'slug' => 'expanded-service-areas-in-lalitpur',
                'category' => 'News',
                'author' => 'Admin',
                'excerpt' => 'Septic-Tank Nepal is proud to announce faster response times and expanded coverage across the Lalitpur and Bhaktapur districts.',
                'content' => "To better serve our growing commercial and residential customer base, Septic-Tank Nepal has stationed dedicated vacuum response units in Kupondole (Lalitpur) and Suryabinayak (Bhaktapur). This allows us to offer 30-45 minute emergency arrival times across the entire valley rim.",
                'icon' => 'newspaper',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDnIFgME7XcwJByHGHPgWozAJdfLmIhxAfxfM4gDICLpQJFEOL14LQz6fWWp8IV_eb9AuwYsza7t4KtABD6aftG5-1bY1OxdvHAiCdxfi_fJn9nLwRiKKXDQzaB1lYlcw5rIhQ21SpFmFwGhfDtDtC0KF6DWF3WWPpG5a4kLe3JqnjA5AgbwExh3R0AH2xbM924jewjiWHcmXFS5hunZ9J7rqXNMkiCOh6b-UAsF2pWL55INU8Vpin',
                'is_featured' => false,
                'published_at' => now()->subDays(15),
            ],
            [
                'title' => 'The Importance of Grease Traps in Commercial Kitchens',
                'slug' => 'importance-of-grease-traps-commercial-kitchens',
                'category' => 'Commercial',
                'author' => 'Admin',
                'excerpt' => 'How regular grease trap cleaning saves restaurants from catastrophic drain clogs and health inspection violations.',
                'content' => "Commercial kitchens process massive volumes of fats, oils, and grease (FOG). Without regular monthly servicing of interceptors and grease traps, cooled grease hardens like cement inside the main pipes, leading to foul backflows and business shutdowns.",
                'icon' => 'description',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI7cIdzb6CdTFXDBA04BFdeZZrpEzXyFAHxlQ66oFQUkEPT4dsseY5yQ7K9JsYv5X7rEXW52M-3cAOaovmqZdl7ZBO6oo51siovdphhhfQ2-NKzpiDJdxIoMX36lswBrpSsGL2Ey_HDHxeSqwthqQcg42sRu2KZyb9YQrVgHOkFPmOiS9eSG3HkpTcFbl4ur7qPZu1CFByM-oLDC6cdXUi9yhmZFHfseVtFezqSX2sFke4kC3Oy5Si',
                'is_featured' => false,
                'published_at' => now()->subDays(20),
            ],
            [
                'title' => 'Identifying Hidden Leaks Before They Cause Damage',
                'slug' => 'identifying-hidden-leaks-before-damage',
                'category' => 'Maintenance',
                'author' => 'Admin',
                'excerpt' => 'Signs of silent underground leaks and how professional acoustic testing protects your foundations.',
                'content' => "Water bills suddenly spiking? Damp spots on plaster walls? Unexplained foundation settlement? Hidden plumbing leaks are silent property destroyers. Learn how our pressure testing and acoustic detection tools locate hidden leaks with zero destructive digging.",
                'icon' => 'description',
                'cover_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWiyCop0ITeHN2CvShSzXnzicz9Q8-yCfBb3o8KHKq_NDxpICdZqMlfJjV-jO7FWpOp2exaDzY3G9rPPGald4k9gvlJjUcp6liN58iHPz4ul10SeBRlVcVqCqzjPnUwwZMQQiME83feZ8VurR-7Y3yuZGaEDOhqYDhbHvxQuIf9Og0TeWpbWngIA_6aQ75U8t8go3t7u57KezfByyxq8dWeFByK4_m_oK_mM4_O40RtbidWi6DzVE',
                'is_featured' => false,
                'published_at' => now()->subDays(25),
            ],
        ];

        foreach ($blogs as $blogData) {
            Blog::updateOrCreate(['slug' => $blogData['slug']], $blogData);
        }

        // 5. Testimonials
        $testimonials = [
            [
                'name' => 'Ramesh K.',
                'location' => 'Lalitpur',
                'rating' => 5,
                'comment' => 'Professional and quick service! They unblocked my drain in no time.',
                'order' => 1,
            ],
            [
                'name' => 'Sita M.',
                'location' => 'Bhaktapur',
                'rating' => 5,
                'comment' => 'Highly recommend for their transparent pricing and expert team.',
                'order' => 2,
            ],
            [
                'name' => 'Anil T.',
                'location' => 'Kathmandu',
                'rating' => 5,
                'comment' => 'Best plumbing service in Kathmandu. They were very careful and hygienic.',
                'order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(['name' => $testimonial['name']], $testimonial);
        }

        // 6. Sample Contact Message
        ContactMessage::updateOrCreate(
            ['phone' => '9841234567'],
            [
                'name' => 'Suman Shrestha',
                'phone' => '9841234567',
                'location' => 'Boudha, Kathmandu',
                'service_needed' => 'Septic Tank Pumping',
                'message' => 'Need emergency septic tank pumping for a residential building.',
                'is_read' => false,
            ]
        );
    }
}
