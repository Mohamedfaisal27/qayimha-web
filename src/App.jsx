import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star, Search, X, User, Users, Library, UserPlus,
  Flame, Compass, Sparkles, Trophy, Flag, Target, Ghost, BrainCircuit,
  Swords, Gem, Puzzle as PuzzleIcon, Layers, Loader2, ChevronLeft, Info, Camera,
  Gamepad2, Gamepad, Monitor, Tv, Smartphone, MessageCircle, Send
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend
} from 'recharts';

/* ---------------------------------- بيانات ---------------------------------- */

const GOLD = '#E8B23D';
const TEAL = '#4FD1C5';
const BG = '#121019';
const SURFACE = '#1C1927';
const SURFACE2 = '#252132';
const MUTED = '#9691A8';
const TEXT = '#F2EFEA';

const BACKEND_URL = 'https://qayimha-server-production-9402.up.railway.app';

const GENRES = {
  action:     { label: 'أكشن',       icon: Flame,        c1: '#7C2D3A', c2: '#2A0D14' },
  adventure:  { label: 'مغامرات',    icon: Compass,      c1: '#1F6F5C', c2: '#0A241E' },
  rpg:        { label: 'آر بي جي',   icon: Sparkles,     c1: '#5B3A9E', c2: '#1D1038' },
  sports:     { label: 'رياضة',      icon: Trophy,       c1: '#B8860B', c2: '#3D2A00' },
  racing:     { label: 'سباق',       icon: Flag,         c1: '#C0392B', c2: '#3D100B' },
  shooter:    { label: 'إطلاق نار',  icon: Target,       c1: '#34495E', c2: '#0F161C' },
  horror:     { label: 'رعب',        icon: Ghost,        c1: '#2C1B3D', c2: '#0B0712' },
  strategy:   { label: 'استراتيجية', icon: BrainCircuit, c1: '#2E6E8E', c2: '#0C222C' },
  fighting:   { label: 'قتال',       icon: Swords,       c1: '#8E3B46', c2: '#2A1015' },
  platformer: { label: 'منصات',      icon: Gem,          c1: '#2F8F7A', c2: '#0E2F27' },
  puzzle:     { label: 'ألغاز',      icon: PuzzleIcon,   c1: '#6B5B95', c2: '#201B32' },
  sim:        { label: 'محاكاة',     icon: Layers,       c1: '#3E7C4A', c2: '#132717' },
};
const GENRE_ORDER = Object.keys(GENRES);

const PLATFORMS_META = {
  PS5:    { label: 'بلايستيشن', icon: Gamepad2 },
  Xbox:   { label: 'إكس بوكس', icon: Gamepad },
  PC:     { label: 'كمبيوتر', icon: Monitor },
  Switch: { label: 'سويتش', icon: Tv },
  Mobile: { label: 'موبايل', icon: Smartphone },
};
const PLATFORM_ORDER = Object.keys(PLATFORMS_META);

const GAMES = [
  { id: 'gta5', name: 'GTA V', genre: 'action', year: 2013, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تجربة مفتوحة العالم في مدينة لوس سانتوس الخيالية، مليئة بالفوضى والحبكات المتشابكة.', summary: 'قصتها تدور حول ثلاث شخصيات: مايكل المتقاعد من عالم الإجرام، وفرانكلين الشاب الطموح، وتريفور المجنون الخطير.\nالقدر يجمعهم بعمليات سرقة كبيرة في مدينة لوس سانتوس.\nكل وحد منهم عنده أسلوبه وشخصيته المختلفة تماماً.\nتقدر تتنقل بين الثلاثة وأنت تلعب وتشوف القصة من زوايا مختلفة.\nمدينة مفتوحة كبيرة مليانة أنشطة جنب الخط الرئيسي للقصة.' },
  { id: 'gtasa', name: 'GTA: San Andreas', genre: 'action', year: 2004, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'الجزء الكلاسيكي الذي جمع بين الأكشن وحرية الاستكشاف في ولاية سان أندرياس.' },
  { id: 'rdr2', name: 'Red Dead Redemption 2', genre: 'adventure', year: 2018, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'ملحمة غربية عن عصابة خارجة عن القانون في أمريكا أواخر القرن التاسع عشر.', summary: 'تحكي قصة آرثر مورجان، عضو في عصابة خارجين عن القانون بأمريكا أواخر القرن التاسع عشر.\nالعصابة تواجه ضغط متزايد من الحكومة والمنافسين، وتضطر تهرب من مكان لمكان.\nآرثر يواجه تساؤلات عن ولائه وقيمه وسط عالم يتغير بسرعة.\nاللعبة تركز على العلاقات بين أفراد العصابة وأسلوب حياتهم.\nعالم مفتوح واسع فيه تفاصيل دقيقة بالطبيعة والحيوانات والمدن.' },
  { id: 'witcher3', name: 'The Witcher 3', genre: 'rpg', year: 2015, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة آر بي جي ضخمة يجسّد فيها اللاعب صياد وحوش في عالم مليء بالأساطير.', summary: 'تجسّد شخصية غيرالت، صياد وحوش محترف يبحث عن ابنته بالتبني المفقودة سيري.\nالعالم مليء بالحروب والسياسة والأساطير الشمالية.\nقراراتك تؤثر على مصير شخصيات كثيرة وتغيّر مسار القصة.\nفيه عالم مفتوح ضخم مليان بمهمات جانبية عميقة بحد ذاتها.\nالقصة تمزج بين الفانتازيا والدراما الإنسانية.' },
  { id: 'eldenring', name: 'Elden Ring', genre: 'rpg', year: 2022, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح قاتم صنعه فريق Dark Souls بالتعاون مع كاتب خيال ملحمي.', summary: 'عالم مفتوح قاتم اسمه الأراضي البينية، دمّره غياب "الحلقة الأثيرية".\nاللاعب يلعب دور "المهزوم"، شخص يسعى يستعيد شظايا الحلقة ويصير لورد جديد.\nالعالم مليان أعداء ضخمين وأسرار وقصص متناثرة تكتشفها بنفسك.\nالمعارك صعبة وتتطلب صبر وتعلم من كل محاولة.\nالقصة مو مباشرة، أغلبها تفهمها من الحوار والبيئة نفسها.' },
  { id: 'darksouls3', name: 'Dark Souls III', genre: 'rpg', year: 2016, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'لعبة معروفة بصعوبتها العالية ومعاركها التي تتطلب دقة وصبر.', summary: 'عالم "لوثريك" ينهار مع اقتراب نهاية عصر النار.\nلاعب يتحكم بـ"غير الموتى" يستيقظ عشان يعيد إشعال النار من جديد.\nيجب يواجه لوردات رماد سابقين هربوا من واجبهم.\nعالم قاتم مترابط مليان أعداء وأسرار مخفية.\nمعروفة بصعوبتها العالية اللي تتطلب صبر وتعلم مستمر.' },
  { id: 'gow2018', name: 'God of War (2018)', genre: 'action', year: 2018, age: '+16', platforms: ['PS5', 'PC'], desc: 'رحلة كريتوس وابنه أتريوس عبر عوالم الأساطير النوردية.', summary: 'كريتوس، محارب سابق من الأساطير اليونانية، يعيش الآن بعالم الأساطير النوردية.\nبعد وفاة زوجته، يسافر مع ابنه أتريوس لنشر رمادها فوق أعلى قمة بالعوالم التسعة.\nالرحلة تكشف علاقة معقدة بين الأب وابنه وأسرار عن ماضي كريتوس.\nيواجهون آلهة وكائنات نوردية أثناء الرحلة.\nأسلوب قتال قوي وقصة إنسانية عميقة عن الأبوة.' },
  { id: 'gowr', name: 'God of War Ragnarök', genre: 'action', year: 2022, age: '+16', platforms: ['PS5', 'PC'], desc: 'استكمال رحلة كريتوس مع اقتراب نهاية العالم النوردي.', summary: 'استكمال لرحلة كريتوس وأتريوس بعد أحداث الجزء الأول.\nنهاية العالم النوردي "راجناروك" تقترب، وكريتوس وأتريوس بمنتصف الصراع.\nيواجهون آلهة وقوى جديدة وسط عالم يتغير بسرعة.\nالعلاقة بين الأب وابنه تتطور أكثر وسط أحداث كبيرة.\nقصة ملحمية تختم فصل مهم من الأساطير النوردية.' },
  { id: 'tlou', name: 'The Last of Us', genre: 'adventure', year: 2013, age: '+12', platforms: ['PS5', 'PC'], desc: 'قصة إنسانية مؤثرة عن البقاء في عالم ما بعد الكارثة.', summary: 'قصة جوييل، مهرّب قاسي يعيش بعد وباء دمّر أغلب البشرية.\nيكلّف بمهمة توصيل فتاة صغيرة اسمها إيلي لمكان معين.\nالرحلة تتحول لعلاقة عميقة بينهم وسط عالم خطير مليان مصابين وناجين آخرين.\nالقصة تركز على البقاء والفقد والعلاقات الإنسانية.\nأجواء قاتمة ومؤثرة طول الرحلة.' },
  { id: 'tlou2', name: 'The Last of Us Part II', genre: 'action', year: 2020, age: '+16', platforms: ['PS5', 'PC'], desc: 'استمرار قصة إيلي في رحلة عن الانتقام وثمنه.', summary: 'استكمال لأحداث الجزء الأول بعد سنوات.\nإيلي تعيش بمجتمع صغير، وحدث معين يدفعها لرحلة انتقام طويلة وقاسية.\nالقصة تنقلك بين وجهات نظر مختلفة لشخصيات متعددة.\nتتطرق لمواضيع صعبة عن العنف والانتقام وثمنه.\nتجربة قصصية مكثفة ومؤثرة عاطفياً.' },
  { id: 'uncharted4', name: 'Uncharted 4', genre: 'adventure', year: 2016, age: '+12', platforms: ['PS5', 'PC'], desc: 'مغامرة سينمائية للباحث عن الكنوز نيثان دريك.', summary: 'نيثان دريك اعتزل مغامراته، لكن أخوه الغائب سام يرجع فجأة ويحتاج مساعدته.\nيدخلون معاً رحلة بحث عن كنز أسطوري مرتبط بقراصنة قدامى.\nالرحلة تختبر علاقة الأخوين وتكشف أسرار من ماضيهم.\nمزيج من الأكشن والاستكشاف والتسلق حول العالم.\nخاتمة مناسبة لسلسلة نيثان دريك الطويلة.' },
  { id: 'horizon', name: 'Horizon Zero Dawn', genre: 'rpg', year: 2017, age: '+16', platforms: ['PS5', 'PC'], desc: 'عالم مفتوح مستقبلي تواجه فيه البطلة آلات ضخمة تشبه الديناصورات.', summary: 'إيلوي، فتاة منبوذة تكبر بقبيلة تعيش وسط آلات ضخمة تشبه الكائنات.\nتبدأ رحلة تبحث فيها عن أصلها وسبب نبذها منذ الصغر.\nتكتشف تدريجياً أسرار كبيرة عن ماضي العالم قبل وصول الآلات.\nعالم مفتوح جميل يجمع الطبيعة بالتكنولوجيا المتطورة.\nمعارك استراتيجية ضد آلات متنوعة الأحجام والقدرات.' },
  { id: 'horizonfw', name: 'Horizon Forbidden West', genre: 'rpg', year: 2022, age: '+16', platforms: ['PS5', 'PC'], desc: 'استكمال مغامرة إيلوي في عالم ما بعد الانهيار التقني.', summary: 'استكمال رحلة إيلوي بعد أحداث الجزء الأول.\nخطر جديد يهدد كل أشكال الحياة، وإيلوي تسافر لمناطق جديدة غرباً.\nتقابل حضارات وقبائل مختلفة وسط رحلتها.\nالقصة تتوسع أكثر بأسرار عالم ما قبل الانهيار.\nآلات جديدة وأساليب قتال أوسع من الجزء الأول.' },
  { id: 'spiderman', name: 'Spider-Man (PS4)', genre: 'action', year: 2018, age: '+16', platforms: ['PS5', 'PC'], desc: 'تجربة تحرّك حر فوق مدينة نيويورك بروح الرجل العنكبوت.', summary: 'بيتر باركر بمنتصف مسيرته كبطل خارق بمدينة نيويورك.\nمواجهة عصابة إجرامية كبيرة تهدد المدينة تدفعه لمواجهة تحديات شخصية ومهنية بنفس الوقت.\nيوازن بين حياته العادية كبيتر وحياته السرية كسبايدرمان.\nحركة تسلق حرة فوق ناطحات السحاب أهم ميزة باللعبة.\nقصة تجمع الأكشن بالدراما الشخصية.' },
  { id: 'spiderman2', name: 'Spider-Man 2', genre: 'action', year: 2023, age: '+16', platforms: ['PS5', 'PC'], desc: 'مغامرة مشتركة لبيتر باركر ومايلز موراليس في نيويورك.' },
  { id: 'ghost', name: 'Ghost of Tsushima', genre: 'action', year: 2020, age: '+16', platforms: ['PS5', 'PC'], desc: 'ساموراي يواجه غزو المغول لجزيرة تسوشيما بأسلوب قتال أنيق.', summary: 'اليابان تتعرض لغزو المغول عام ١٢٧٤م، وجين ساكاي ساموراي ناجٍ من المعركة الأولى.\nيضطر يخرج عن تقاليد الساموراي التقليدية عشان يقاوم الغزاة بأي طريقة ممكنة.\nيواجه صراع داخلي بين شرفه كساموراي وضرورة النجاة.\nعالم مفتوح جميل بصرياً مستوحى من جزيرة تسوشيما الحقيقية.\nقتال أنيق يجمع بين المبارزة والتخفي.' },
  { id: 'zelda_botw', name: 'Zelda: Breath of the Wild', genre: 'adventure', year: 2017, age: '+12', platforms: ['Switch'], desc: 'استكشاف مفتوح لمملكة هايرول بحرية كاملة في الحل والتنقل.', summary: 'لينك يستيقظ بعد مئة سنة من نوم عميق، بلا ذاكرة عن ماضيه.\nمملكة هايرول مدمّرة، وشر قديم اسمه "غانون الغضبان" يهددها من جديد.\nلينك يجب يستعيد قوته ويجمع حلفاء عشان يواجه التهديد.\nحرية استكشاف كاملة، تقدر توصل أي مكان بأي طريقة تحبها.\nألغاز ومهارات وأسلحة متنوعة تكتشفها بنفسك.' },
  { id: 'zelda_totk', name: 'Zelda: Tears of the Kingdom', genre: 'adventure', year: 2023, age: '+12', platforms: ['Switch'], desc: 'استكمال مغامرات لينك مع عوالم علوية وأدوات بناء جديدة.', summary: 'استكمال أحداث البداية بعد اكتشاف قوة قديمة تحت قلعة هايرول.\nجزر عائمة جديدة تظهر فوق السماء، وأسرار جديدة تنتظر لينك.\nقدرات بناء وتركيب غريبة تفتح أساليب لعب إبداعية.\nزيلدا نفسها تختفي بظروف غامضة تدفع لينك للبحث عنها.\nعالم أوسع بكثير من الجزء السابق، فوق وتحت الأرض.' },
  { id: 'mario_odyssey', name: 'Super Mario Odyssey', genre: 'platformer', year: 2017, age: '+3', platforms: ['Switch'], desc: 'رحلة ماريو حول العالم لإنقاذ الأميرة بيتش بأسلوب منصات مرح.' },
  { id: 'minecraft', name: 'Minecraft', genre: 'sim', year: 2011, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'عالم مكعبات مفتوح للبناء والاستكشاف والبقاء.', summary: 'ما فيه قصة رسمية محددة — أنت تبني عالمك الخاص من الصفر.\nتجمع موارد، تبني منشآت، وتستكشف كهوف وأبعاد مختلفة.\nفيه وضع بقاء يواجهك بمخلوقات ليلية، ووضع إبداعي للبناء الحر.\nكل عالم يتولّد عشوائياً فريد من نوعه.\nحرية كاملة تسوي أي شي يخطر ببالك.' },
  { id: 'fortnite', name: 'Fortnite', genre: 'shooter', year: 2017, age: '+13', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'معركة بقاء جماعية بأسلوب بناء فريد اكتسب شعبية عالمية.', summary: 'معركة بقاء جماعية، ١٠٠ لاعب ينزلون بجزيرة واحدة وآخر واحد ناجٍ يفوز.\nمنطقة اللعب تصغر مع الوقت وتجبر اللاعبين يتقاربون.\nنظام بناء فريد يخليك تسوي جدران وأبراج أثناء القتال.\nمواسم دورية تجيب خرائط وقصص وتعاونات جديدة باستمرار.\nفيه أوضاع لعب ثانية غير المعركة الجماعية الأساسية.' },
  { id: 'pubg', name: 'PUBG', genre: 'shooter', year: 2017, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'من أوائل ألعاب البقاء الجماعي battle royale التي انتشرت عالمياً.' },
  { id: 'codmw2', name: 'Call of Duty: Modern Warfare II', genre: 'shooter', year: 2022, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'جزء حديث من سلسلة الحرب العسكرية الشهيرة.' },
  { id: 'warzone', name: 'Call of Duty: Warzone', genre: 'shooter', year: 2020, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'نسخة battle royale مجانية من عالم Call of Duty.' },
  { id: 'apex', name: 'Apex Legends', genre: 'shooter', year: 2019, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'معركة بقاء جماعية بأبطال يمتلك كل منهم قدرات مميزة.' },
  { id: 'valorant', name: 'Valorant', genre: 'shooter', year: 2020, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'لعبة تصويب تكتيكية بأبطال ذوي قدرات خاصة.' },
  { id: 'cs2', name: 'Counter-Strike 2', genre: 'shooter', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'النسخة الحديثة من أشهر لعبة تصويب تنافسية في التاريخ.' },
  { id: 'overwatch2', name: 'Overwatch 2', genre: 'shooter', year: 2022, age: '+13', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب جماعي بأبطال متنوعين وأسلوب لعب فرقي.' },
  { id: 'fc24', name: 'EA Sports FC 24', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة كرة قدم من نفس صناع سلسلة فيفا سابقاً.' },
  { id: 'fc25', name: 'EA Sports FC 25', genre: 'sports', year: 2024, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال سلسلة محاكاة كرة القدم بتحديثات جديدة.', summary: 'محاكاة كرة قدم رسمية تغطي دوريات وأندية ومنتخبات حقيقية حول العالم.\nفيه أوضاع مختلفة: مباريات سريعة، مسيرة لاعب، بناء فريق أحلامك.\nتحديثات سنوية تجيب لاعبين وتشكيلات جديدة كل موسم.\nتجربة واقعية بأسلوب لعب واحتكاك محسّن كل إصدار.\nمناسبة لعشاق كرة القدم اللي يبون تجربة قريبة من الواقع.' },
  { id: 'nba2k24', name: 'NBA 2K24', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة احترافية لدوري السلة الأمريكي.' },
  { id: 'rocketleague', name: 'Rocket League', genre: 'sports', year: 2015, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مزيج غريب وممتع بين كرة القدم وسباق السيارات.' },
  { id: 'forzahorizon5', name: 'Forza Horizon 5', genre: 'racing', year: 2021, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'سباقات مفتوحة العالم في أجواء المكسيك الخلابة.' },
  { id: 'gt7', name: 'Gran Turismo 7', genre: 'racing', year: 2022, age: '+7', platforms: ['PS5'], desc: 'محاكاة سباقات واقعية تركّز على تفاصيل السيارات الدقيقة.' },
  { id: 'mariokart8', name: 'Mario Kart 8 Deluxe', genre: 'racing', year: 2017, age: '+3', platforms: ['Switch'], desc: 'سباقات ممتعة وفوضوية بشخصيات عالم ماريو.', summary: 'سباقات مرحة وفوضوية بشخصيات عالم ماريو المألوفة.\nكل مضمار له طابعه الخاص وعناصر غريبة زي الطيران وتحت الماء.\nأدوات وأسلحة غريبة تقلب موازين السباق بأي لحظة.\nفيه أوضاع فردية وجماعية للعب مع الأصدقاء والعائلة.\nمناسبة لكل الأعمار وسهلة تتعلمها بسرعة.' },
  { id: 'nfsheat', name: 'Need for Speed Heat', genre: 'racing', year: 2019, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'سباقات شوارع ليلية مع مطاردات من الشرطة.' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', genre: 'rpg', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح مستقبلي في مدينة نايت سيتي المليئة بالتكنولوجيا والجريمة.', summary: 'في مدينة نايت سيتي المستقبلية، تلعب دور V، مرتزق يبحث عن فرصته الكبرى.\nيحصل على غرسة تقنية غريبة تحتوي وعي شخصية أسطورية بالماضي.\nيضطر يتعامل مع هذا الوعي وهو يبحث عن طريقة يتخلص منه.\nالمدينة مليانة عصابات وشركات ضخمة تتصارع على النفوذ.\nقرارات اللاعب تشكّل مسار القصة ونهايتها.' },
  { id: 'bg3', name: "Baldur's Gate 3", genre: 'rpg', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي عميقة مبنية على قواعد دنجنز آند دراجونز.', summary: 'مجموعة شخصيات مصابة بطفيليات دماغية غريبة تهدد تحويلهم لمخلوقات وحشية.\nيضطرون يتعاونون عشان يلقون علاج قبل فوات الأوان.\nالرحلة تكشف مؤامرة أكبر بكثير من مجرد الطفيلي نفسه.\nحرية كبيرة بالحوار والقرارات تغيّر مجرى القصة بشكل جذري.\nنظام قتال بالأدوار مبني على قواعد دنجنز آند دراجونز.' },
  { id: 'diablo4', name: 'Diablo IV', genre: 'rpg', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة قتالية مظلمة تعتمد على جمع الأسلحة والمعدات.' },
  { id: 'ff7remake', name: 'Final Fantasy VII Remake', genre: 'rpg', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة تصور لواحدة من أشهر ألعاب الآر بي جي اليابانية.', summary: 'كلاود سترايف، مرتزق سابق، ينضم لمجموعة مقاومة ضد شركة ضخمة تستنزف موارد الكوكب.\nمهمتهم الأولى تفجير مفاعل طاقة بمدينة ميدغار.\nالأحداث تتشابك بأسرار عن ماضي كلاود وعلاقته بشخصيات غامضة.\nإعادة تصور حديثة لقصة كلاسيكية بقتال حركي وسينمائي.\nيغطي الجزء الأول بس جزء من القصة الأصلية الكاملة.' },
  { id: 'persona5', name: 'Persona 5 Royal', genre: 'rpg', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'قصة طلاب يعيشون حياة مزدوجة بين المدرسة وعالم خارق للطبيعة.', summary: 'مجموعة طلاب يكتسبون قدرة غريبة يقدرون فيها يدخلون "قلوب" الناس الفاسدين.\nيكوّنون فريق "فانتوم" يسرقون رغبات فاسدة من قلوب كبار الفاسدين.\nبالنهار حياة طلابية عادية، وبالليل مغامرات خارقة للطبيعة.\nكل شخصية بالفريق لها قصتها الشخصية وأسبابها الخاصة.\nمزيج فريد بين آر بي جي ومحاكاة حياة يومية.' },
  { id: 're4remake', name: 'Resident Evil 4 Remake', genre: 'horror', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة صنع لجزء كلاسيكي من سلسلة رعب البقاء الشهيرة.', summary: 'ليون كينيدي، عميل حكومي، يرسل لمهمة إنقاذ ابنة الرئيس المخطوفة بقرية أوروبية نائية.\nيكتشف إن القرية مصابة بطائفة غامضة تسيطر على عقول السكان.\nالمهمة تتحول لصراع بقاء ضد مخلوقات وحشية متعددة.\nمزيج من الرعب والأكشن بأسلوب قتال دقيق.\nإعادة صنع حديثة لواحدة من أهم ألعاب الرعب بالتاريخ.' },
  { id: 'revillage', name: 'Resident Evil Village', genre: 'horror', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة رعب في قرية أوروبية غامضة مليئة بالمخلوقات.', summary: 'إيثان وينترز يبحث عن ابنته المخطوفة بقرية أوروبية غامضة مليانة بمخلوقات.\nيواجه عائلة غريبة تسيطر على القرية بقدرات خارقة للطبيعة.\nالأجواء قوطية مظلمة تجمع الرعب بعناصر أكشن.\nاستكمال غير مباشر لأحداث الجزء السابع بالسلسلة.\nقصة تكشف تدريجياً أسرار مظلمة عن القرية وسكانها.' },
  { id: 'residentevil_remake', name: 'Resident Evil (2002)', genre: 'horror', year: 2002, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'إعادة صنع كلاسيكية للجزء الأول اللي أسس سلسلة رعب البقاء بالكامل.', summary: 'مجموعة S.T.A.R.S. ترسل للتحقيق باختفاء فريق سابق قرب قصر مهجور بضواحي راكون سيتي.\nيكتشفون القصر مليان مخلوقات مصابة نتيجة تجارب سرية لشركة أمبريلا.\nيضطرون يستكشفون كل زاوية بالقصر بحثاً عن مخرج ووسيلة نجاة.\nنقص الذخيرة والموارد يخلي كل قرار مهم ومحسوب.\nاللعبة اللي أسست كل قواعد رعب البقاء المعروفة اليوم.' },
  { id: 'residentevil2', name: 'Resident Evil 2', genre: 'horror', year: 2019, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة صنع لجزء كلاسيكي عن ليون وكلير وسط مدينة راكون سيتي المصابة.', summary: 'ليون كينيدي، شرطي جديد بيومه الأول، يوصل راكون سيتي ليلقاها مدينة أشباح مليانة زومبي.\nكلير ريدفيلد توصل بنفس الوقت تبحث عن أخوها كريس المفقود.\nالاثنين يضطرون يتعاونون للنجاة من المدينة المنهارة.\nقصتين متوازيتين تتقاطعان أثناء الهروب من مركز الشرطة والمدينة.\nإعادة صنع حديثة لواحدة من أهم ألعاب الرعب الكلاسيكية.' },
  { id: 'residentevil3', name: 'Resident Evil 3', genre: 'horror', year: 2020, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'جيل فالنتاين تهرب من مطارد وحشي وسط انهيار المدينة.', summary: 'جيل فالنتاين تحاول تهرب من راكون سيتي قبل ما تدمرها الحكومة بالكامل.\nمطارد وحشي شبه لا يُقهر يلاحقها بلا توقف طول اللعبة.\nتتقاطع أحداثها مع فترة قريبة من أحداث الجزء الثاني.\nسباق مستمر مع الوقت والخطر يخلي كل لحظة متوترة.\nإعادة صنع تركز على السرعة والتوتر أكثر من الاستكشاف البطيء.' },
  { id: 'residentevil4_original', name: 'Resident Evil 4', genre: 'horror', year: 2005, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'النسخة الأصلية الكلاسيكية اللي غيّرت أسلوب ألعاب الرعب للأبد.', summary: 'ليون كينيدي، عميل حكومي، يرسل لمهمة إنقاذ ابنة الرئيس المخطوفة بقرية أوروبية نائية.\nيكتشف إن القرية مصابة بطائفة غامضة تسيطر على عقول السكان.\nالمهمة تتحول لصراع بقاء ضد مخلوقات وحشية متعددة.\nالنسخة الأصلية اللي غيّرت أسلوب ألعاب الرعب للأبد بمنظورها الجديد.\nيعتبرها كثيرون أفضل لعبة بالسلسلة كاملة لين اليوم.' },
  { id: 'residentevil5', name: 'Resident Evil 5', genre: 'horror', year: 2009, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'كريس ريدفيلد يواجه تهديد بيولوجي جديد بأفريقيا بأسلوب تعاوني.', summary: 'كريس ريدفيلد يسافر لأفريقيا للتحقيق بتقارير عن تفشي بيولوجي خطير.\nيرافقه شيفا ألومار، عميلة محلية تعرف المنطقة جيداً.\nيكتشفون مؤامرة أكبر مرتبطة بأمبريلا وأعداء من ماضي السلسلة.\nأسلوب لعب تعاوني كامل مصمم للعب مع صديق.\nمعارك أكشن أضخم مقارنة بالأجزاء السابقة الأبطأ إيقاعاً.' },
  { id: 'residentevil6', name: 'Resident Evil 6', genre: 'horror', year: 2012, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'أربع حملات متوازية تجمع أبطال السلسلة ضد أزمة بيولوجية عالمية.', summary: 'أربع حملات متوازية تجمع ليون وكريس وأبطال جدد ضد أزمة بيولوجية عالمية.\nهجمات إرهابية بفيروس جديد تنتشر بمدن مختلفة حول العالم بنفس الوقت.\nكل حملة لها أسلوب لعب وشخصيات مختلفة تتقاطع قصصها مع بعض.\nنطاق ملحمي أكبر بكثير من أي جزء سابق بالسلسلة.\nمزيج من الرعب والأكشن العسكري المكثف.' },
  { id: 'residentevil7', name: 'Resident Evil 7: Biohazard', genre: 'horror', year: 2017, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إيثان وينترز يدخل منزل مزرعة مرعب بحثاً عن زوجته المفقودة.', summary: 'إيثان وينترز يوصل مزرعة مهجورة بلويزيانا بحثاً عن زوجته المفقودة ميا.\nيكتشف عائلة بيكر الغريبة اللي تسيطر على المنزل بقوى مخيفة.\nالمنظور يتحول للشخص الأول لأول مرة بالسلسلة، يزيد التوتر والرعب.\nالمنزل نفسه مليان ألغاز وأسرار مظلمة عن العائلة.\nعودة قوية لأسلوب الرعب البطيء المكثف بعد أجزاء أكشن سريعة.' },
  { id: 'residentevil0', name: 'Resident Evil Zero', genre: 'horror', year: 2002, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'قصة جانبية سابقة لأحداث الجزء الأول، تتبع ريبيكا تشامبرز وبيلي كوين.', summary: 'قصة جانبية سابقة لأحداث الجزء الأول، تتبع ريبيكا تشامبرز وبيلي كوين.\nقطار مهجور يقودهم لمنشأة تدريب تابعة لأمبريلا مليانة تجارب فاشلة.\nيضطرون يتعاونون رغم إن بيلي مطلوب هارب من العدالة.\nنظام تبديل الشخصيات يفتح طرق جديدة لحل الألغاز.\nتكشف أسرار مبكرة عن بداية كارثة راكون سيتي.' },
  { id: 'residentevilrevelations', name: 'Resident Evil: Revelations', genre: 'horror', year: 2012, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'جيل فالنتاين تحقق بسفينة أشباح مهجورة وسط المحيط.', summary: 'جيل فالنتاين وباركر لوتشياني يحققون باختفاء سفينة أشباح بمنتصف المحيط.\nيكتشفون السفينة مليانة مخلوقات مصابة بفيروس جديد غامض.\nبنفس الوقت، كريس ريدفيلد يحقق بحادثة منفصلة ترتبط بنفس اللغز.\nالقصتين تتقاطعان تدريجياً وتكشفان مؤامرة أكبر.\nأجواء رعب مغلقة ومقلقة تشبه أفلام الرعب بالسفن.' },
  { id: 'residentevilrevelations2', name: 'Resident Evil: Revelations 2', genre: 'horror', year: 2015, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'كلير ريدفيلد ومويرا بيرتون محتجزات بسجن مهجور مليان مخلوقات.', summary: 'كلير ريدفيلد ومويرا بيرتون يختطفن ويستيقظن بجزيرة سجن مهجورة مليانة مخلوقات.\nبنفس الوقت، بابا مويرا باري بيرتون يوصل الجزيرة يبحث عن ابنته بعد فترة.\nيقابل فتاة غامضة تساعده بقدرة غريبة على استشعار الأعداء.\nقصتين بفترتين زمنيتين مختلفتين تتكشفان مع بعض.\nتركيبة تعاونية بين شخصيتين بقدرات مكملة لبعض.' },
  { id: 'residentevilcodeveronica', name: 'Resident Evil: Code Veronica X', genre: 'horror', year: 2000, age: '+18', platforms: ['PS5'], desc: 'كلير ريدفيلد تبحث عن أخوها كريس وسط جزيرة معزولة تابعة لشركة أمبريلا.', summary: 'كلير ريدفيلد تبحث عن أخوها كريس بعد أحداث راكون سيتي، وتنتهي بها الحال أسيرة بجزيرة معزولة تابعة لأمبريلا.\nتتعرف على شخصيات جديدة وسط الجزيرة الغامضة المليانة تجارب فاشلة.\nكريس نفسه يوصل لاحقاً بحثاً عن أخته وسط نفس الأحداث.\nعائلة أشفورد الغامضة تحكم الجزيرة بأسرار مظلمة خاصة فيها.\nقصة مباشرة بين أحداث الجزء الثاني والرابع بالسلسلة.' },
  { id: 'sh2remake', name: 'Silent Hill 2 Remake', genre: 'horror', year: 2024, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة إحياء لأحد أعمق ألعاب الرعب النفسي في التاريخ.' },
  { id: 'deadspace', name: 'Dead Space Remake', genre: 'horror', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'رعب فضائي في محطة مهجورة مليئة بمخلوقات مرعبة.' },
  { id: 'alanwake2', name: 'Alan Wake II', genre: 'horror', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قصة رعب نفسي غامضة عن كاتب عالق في عالم مظلم.' },
  { id: 'hades', name: 'Hades', genre: 'action', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة تتكرر فيها المحاولات للهروب من العالم السفلي بأسلوب سريع وممتع.', summary: 'زغريوس، ابن إله العالم السفلي، يحاول يهرب من مملكة أبوه المظلمة.\nكل محاولة هروب فاشلة ترجعه للبداية، لكن العلاقات مع الشخصيات تتطور مع كل محاولة.\nيقابل آلهة أساطير يونانية تساعده بقوى خاصة أثناء رحلته.\nأسلوب قتال سريع مع تنوع كبير بالأسلحة والقدرات.\nقصة تتكشف تدريجياً كل ما تعيد المحاولة.' },
  { id: 'hollowknight', name: 'Hollow Knight', genre: 'platformer', year: 2017, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'عالم تحت أرضي مرسوم يدوياً مليء بالاستكشاف والمعارك الصعبة.', summary: 'مملكة "هالونيست" تحت الأرض، مليانة حشرات وكائنات غامضة، انهارت لأسباب غامضة.\nفارس صامت يستكشف الأنقاض بحثاً عن إجابات عن ماضي المملكة.\nيواجه أعداء ورؤساء صعبين أثناء استكشافه للأنفاق المتشابكة.\nالقصة تُروى بشكل غير مباشر عبر البيئة والشخصيات الثانوية.\nفن مرسوم يدوياً وأجواء حزينة وغامضة.' },
  { id: 'celeste', name: 'Celeste', genre: 'platformer', year: 2018, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لعبة منصات صعبة عن فتاة تتسلق جبلاً وتواجه مخاوفها.' },
  { id: 'stardewvalley', name: 'Stardew Valley', genre: 'sim', year: 2016, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'محاكاة حياة زراعية هادئة في قرية صغيرة.', summary: 'ترث مزرعة قديمة من جدك وتقرر تترك حياة المدينة المزدحمة.\nتبدأ حياة جديدة هادئة بقرية صغيرة، تزرع وتربي حيوانات وتتعرف على السكان.\nفيه مناجم للاستكشاف وأسماك للصيد ومهرجانات موسمية.\nتقدر تبني علاقات وحتى تتزوج من شخصيات القرية.\nتجربة هادئة تركز على بناء حياة بالسرعة اللي تناسبك.' },
  { id: 'amongus', name: 'Among Us', genre: 'sim', year: 2018, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لعبة اجتماعية عن كشف الخائن بين طاقم سفينة فضائية.' },
  { id: 'genshin', name: 'Genshin Impact', genre: 'rpg', year: 2020, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح ملون بأسلوب أنمي مع نظام عناصر قتالية.', summary: 'مسافر يصل لعالم "تيفات" بحثاً عن أخته أو أخوه التوأم المفقود.\nكل منطقة بالعالم لها إله عنصري خاص يحكمها بأسلوبه.\nالمسافر يتنقل بين المناطق ويكتشف أسرار كل واحدة منها.\nنظام عناصر قتالية يخليك تجمع بين قدرات شخصيات مختلفة.\nعالم مفتوح ملون مستمر يضيف مناطق وقصص جديدة باستمرار.' },
  { id: 'lol', name: 'League of Legends', genre: 'strategy', year: 2009, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أشهر ألعاب الموبا التنافسية عالمياً بفرق من خمسة لاعبين.' },
  { id: 'dota2', name: 'Dota 2', genre: 'strategy', year: 2013, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'لعبة موبا استراتيجية عميقة بمجتمع تنافسي ضخم.' },
  { id: 'aoe4', name: 'Age of Empires IV', genre: 'strategy', year: 2021, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية تاريخية ببناء الحضارات وقيادة الجيوش.' },
  { id: 'civ6', name: 'Civilization VI', genre: 'strategy', year: 2016, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'بناء حضارة عبر التاريخ من العصر الحجري حتى الفضاء.' },
  { id: 'sf6', name: 'Street Fighter 6', genre: 'fighting', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'الجزء الجديد من سلسلة القتال الكلاسيكية بأسلوب حديث.' },
  { id: 'mk1', name: 'Mortal Kombat 1', genre: 'fighting', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة انطلاق سلسلة القتال الدموية الشهيرة.' },
  { id: 'tekken8', name: 'Tekken 8', genre: 'fighting', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استمرار سلسلة قتال عريقة بحركات وشخصيات متنوعة.' },
  { id: 'ittakestwo', name: 'It Takes Two', genre: 'adventure', year: 2021, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة تعاونية مصممة خصيصاً للعب بين شخصين فقط.' },
  { id: 'portal2', name: 'Portal 2', genre: 'puzzle', year: 2011, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'ألغاز إبداعية تعتمد على بوابات انتقال فيزيائية ذكية.' },

  { id: 'freefire', name: 'Free Fire', genre: 'shooter', year: 2017, age: '+18', platforms: ['Mobile'], desc: 'معركة بقاء جماعية خفيفة مصممة للهواتف، منتشرة جداً بالمنطقة العربية.' },
  { id: 'pubgmobile', name: 'PUBG Mobile', genre: 'shooter', year: 2018, age: '+18', platforms: ['Mobile'], desc: 'نسخة الهاتف من لعبة البقاء الجماعي الشهيرة.' },
  { id: 'clashofclans', name: 'Clash of Clans', genre: 'strategy', year: 2012, age: '+12', platforms: ['Mobile'], desc: 'بناء قرية وتدريب جيوش لمهاجمة قرى لاعبين آخرين.' },
  { id: 'clashroyale', name: 'Clash Royale', genre: 'strategy', year: 2016, age: '+12', platforms: ['Mobile'], desc: 'معارك بطاقات سريعة بين لاعبين بشخصيات عالم Clash.' },
  { id: 'brawlstars', name: 'Brawl Stars', genre: 'shooter', year: 2018, age: '+18', platforms: ['Mobile'], desc: 'معارك جماعية سريعة بشخصيات متنوعة القدرات على الهاتف.' },
  { id: 'mobilelegends', name: 'Mobile Legends: Bang Bang', genre: 'strategy', year: 2016, age: '+12', platforms: ['Mobile'], desc: 'لعبة موبا شهيرة على الهاتف بمعارك خمسة ضد خمسة.' },
  { id: 'efootball', name: 'eFootball 2024', genre: 'sports', year: 2023, age: '+3', platforms: ['Mobile'], desc: 'محاكاة كرة قدم مجانية بديلة لسلسلة برو إيفولوشن.' },

  { id: 'halflife2', name: 'Half-Life 2', genre: 'shooter', year: 2004, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'لعبة تصويب أثّرت بصناعة الألعاب بقصتها وفيزيائها المبتكرة.' },
  { id: 'portal1', name: 'Portal', genre: 'puzzle', year: 2007, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لغز فيزيائي عن بوابات انتقال ومختبر غامض.' },
  { id: 'doometernal', name: 'Doom Eternal', genre: 'shooter', year: 2020, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب سريع وعنيف يواجه فيه اللاعب جحافل الجحيم.' },
  { id: 'bioshock', name: 'BioShock', genre: 'shooter', year: 2007, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة قصصية عميقة داخل مدينة تحت الماء منهارة.' },

  { id: 'skyrim', name: 'The Elder Scrolls V: Skyrim', genre: 'rpg', year: 2011, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي مفتوحة العالم في أرض مليئة بالتنانين والأساطير الشمالية.', summary: 'اللاعب يكتشف إنه "دوفاكين"، شخص عنده روح تنين بجسد بشري.\nمقاطعة سكايريم بمنتصف حرب أهلية، وتنانين قديمة بدأت ترجع فجأة.\nيجب يتعلم اللاعب "صرخات" قوى التنانين عشان يواجه التهديد القادم.\nعالم مفتوح ضخم مليان مهمات جانبية وأسرار ومدن متنوعة.\nحرية كاملة تختار فيها مسارك: محارب، ساحر، أو لص.' },
  { id: 'fallout4', name: 'Fallout 4', genre: 'rpg', year: 2015, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكشاف عالم ما بعد نووي مليء بالقرارات الأخلاقية.' },
  { id: 'masseffect2', name: 'Mass Effect 2', genre: 'rpg', year: 2010, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'ملحمة فضائية تعتمد على بناء فريق وقرارات مؤثرة بالقصة.' },
  { id: 'dragonage', name: 'Dragon Age: Inquisition', genre: 'rpg', year: 2014, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي فانتازيا بعالم مفتوح وقرارات سياسية معقدة.' },

  { id: 'bloodborne', name: 'Bloodborne', genre: 'rpg', year: 2015, age: '+16', platforms: ['PS5'], desc: 'مغامرة قوطية مظلمة بقتال سريع وعالم غامض مستوحى من الرعب الكوني.', summary: 'صياد يصل لمدينة "يارنام" الغامضة بحثاً عن علاج لمرض غريب.\nيكتشف إن المدينة مصابة بلعنة تحول سكانها لمخلوقات وحشية ليلاً.\nكل ليلة تكشف أسرار أعمق عن طبيعة المدينة الحقيقية.\nأجواء رعب كوني قوطي مظلمة طول اللعبة.\nقتال سريع وعدواني يختلف عن أسلوب دارك سولز التقليدي.' },
  { id: 'sekiro', name: 'Sekiro: Shadows Die Twice', genre: 'action', year: 2019, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'لعبة قتال ساموراي تعتمد على التوقيت والمبارزة الدقيقة.', summary: 'ساموراي يلقب "الذئب" ينجو من هزيمة قاسية فقد فيها ذراعه.\nيحصل على ذراع اصطناعية وقدرات خاصة ويبدأ رحلة انتقام واستعادة سيده المخطوف.\nاليابان الإقطاعية بمنتصف حرب وفوضى.\nقتال يعتمد على التوقيت والمبارزة الدقيقة أكثر من القوة الغاشمة.\nقصة عن الشرف والولاء وسط عالم قاسٍ.' },
  { id: 'nioh', name: 'Nioh', genre: 'rpg', year: 2017, age: '+16', platforms: ['PS5', 'PC'], desc: 'آر بي جي قتالية بأجواء اليابان الإقطاعية وأرواح الساموراي.' },

  { id: 'mhworld', name: 'Monster Hunter: World', genre: 'rpg', year: 2018, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'صيد وحوش ضخمة بالتعاون مع فريق وصناعة معدات من بقاياها.' },
  { id: 'mhrise', name: 'Monster Hunter Rise', genre: 'rpg', year: 2021, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال سلسلة صيد الوحوش بحركة أسرع وأدوات تسلق جديدة.' },

  { id: 'yakuzalad', name: 'Like a Dragon: Infinite Wealth', genre: 'rpg', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أحدث أجزاء سلسلة يعكوزا بقصة تجمع بين الدراما والفكاهة في هاواي واليابان.' },
  { id: 'yakuza0', name: 'Yakuza 0', genre: 'action', year: 2015, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قصة عصابات يابانية في طوكيو وأوساكا أواخر الثمانينات.' },

  { id: 'ac_valhalla', name: "Assassin's Creed Valhalla", genre: 'action', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة فايكنج مفتوحة العالم بأسلوب غزو ونهب واستكشاف.' },
  { id: 'ac_odyssey', name: "Assassin's Creed Odyssey", genre: 'rpg', year: 2018, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'رحلة في اليونان القديمة بعناصر آر بي جي وقرارات متعددة.' },
  { id: 'batman_arkhamknight', name: 'Batman: Arkham Knight', genre: 'action', year: 2015, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'خاتمة ثلاثية باتمان بأسلوب قتال وتخفٍّ في مدينة غوثام.' },
  { id: 'deathstranding', name: 'Death Stranding', genre: 'adventure', year: 2019, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة غريبة عن توصيل شحنات في عالم ما بعد كارثة تفصل الناس عن بعض.' },
  { id: 'daysgone', name: 'Days Gone', genre: 'action', year: 2019, age: '+16', platforms: ['PS5', 'PC'], desc: 'بقاء في عالم مفتوح مليء بحشود من الزومبي.' },
  { id: 'controlgame', name: 'Control', genre: 'action', year: 2019, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أكشن خارق للطبيعة داخل مبنى حكومي سري متغير الشكل.', summary: 'جيسي فادن توصل لمبنى حكومي سري اسمه "أقدم البيت" بحثاً عن أخوها المفقود.\nالمبنى يتعرض لغزو كائن خارق يهدد الواقع نفسه.\nجيسي تكتسب قوى خارقة وتصير المديرة الجديدة للمبنى بالصدفة.\nالمبنى نفسه غريب، بيئته تتغير وتتحدى قوانين الفيزياء.\nأجواء غامضة تمزج بين الخيال العلمي والرعب النفسي.' },
  { id: 'untildawn', name: 'Until Dawn', genre: 'horror', year: 2015, age: '+18', platforms: ['PS5', 'PC'], desc: 'رعب تفاعلي قراراتك تحدد مصير مجموعة أصدقاء بجبل معزول.' },
  { id: 'detroit', name: 'Detroit: Become Human', genre: 'adventure', year: 2018, age: '+12', platforms: ['PS5', 'PC'], desc: 'قصة تفاعلية عن آليين يبدؤون يطورون وعياً في مستقبل قريب.' },

  { id: 'nierautomata', name: 'NieR: Automata', genre: 'rpg', year: 2017, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قصة فلسفية عن آليين قتاليين بأسلوب قتال سريع وحبكة متعددة النهايات.' },
  { id: 'dmc5', name: 'Devil May Cry 5', genre: 'action', year: 2019, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أكشن سريع بأساليب قتال متنوعة وشخصيات مميزة.' },
  { id: 'bayonetta3', name: 'Bayonetta 3', genre: 'action', year: 2022, age: '+16', platforms: ['Switch'], desc: 'أكشن ساحرة أنيقة بحركات قتالية جنونية.' },

  { id: 'terraria', name: 'Terraria', genre: 'sim', year: 2011, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'بناء واستكشاف ثنائي الأبعاد بعالم مليء بالمغامرات.' },
  { id: 'subnautica', name: 'Subnautica', genre: 'sim', year: 2018, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكشاف بقاء تحت الماء في كوكب غريب.' },
  { id: 'nomanssky', name: "No Man's Sky", genre: 'sim', year: 2016, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكشاف كون شبه لا نهائي من الكواكب المولدة إجرائياً.' },
  { id: 'outerwilds', name: 'Outer Wilds', genre: 'puzzle', year: 2019, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكشاف نظام شمسي غامض عالق في حلقة زمنية متكررة.' },
  { id: 'disco_elysium', name: 'Disco Elysium', genre: 'rpg', year: 2019, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي حواري عميق عن محقق يحاول استعادة ذاكرته.' },
  { id: 'cultofthelamb', name: 'Cult of the Lamb', genre: 'action', year: 2022, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'بناء طائفة دينية مع معارك روغلايك سريعة.' },
  { id: 'vampiresurvivors', name: 'Vampire Survivors', genre: 'action', year: 2022, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لعبة بقاء بسيطة الشكل لكنها مسببة للإدمان بأعداد ضخمة من الأعداء.' },
  { id: 'balatro', name: 'Balatro', genre: 'puzzle', year: 2024, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لعبة بطاقات بوكر إستراتيجية أدمنها لاعبون كثيرون حول العالم.' },
  { id: 'inside_playdead', name: 'Inside', genre: 'puzzle', year: 2016, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة ألغاز قاتمة بأجواء غامضة وصامتة.' },
  { id: 'limbo', name: 'Limbo', genre: 'puzzle', year: 2010, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة أبيض وأسود مليئة بالألغاز والأجواء المقلقة.' },
  { id: 'cuphead', name: 'Cuphead', genre: 'platformer', year: 2017, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'منصات صعبة بأسلوب رسوم متحركة كلاسيكية من الثلاثينات.' },
  { id: 'oriblindforest', name: 'Ori and the Blind Forest', genre: 'platformer', year: 2015, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'منصات جميلة بصرياً عن روح غابة تحاول إنقاذ عالمها.' },
  { id: 'littlenightmares2', name: 'Little Nightmares II', genre: 'horror', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة رعب بأسلوب فني مصغّر ومقلق.' },
  { id: 'plaguetale', name: 'A Plague Tale: Requiem', genre: 'adventure', year: 2022, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة أخوين وسط أوبئة وحشود جرذان بفرنسا القرون الوسطى.' },
  { id: 'papersplease', name: 'Papers, Please', genre: 'sim', year: 2013, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'محاكاة عمل حارس حدود في دولة خيالية شمولية.' },
  { id: 'thiswarofmine', name: 'This War of Mine', genre: 'sim', year: 2014, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة بقاء مدنيين وسط حرب، تركز على الجانب الإنساني القاسي.' },
  { id: 'frostpunk', name: 'Frostpunk', genre: 'strategy', year: 2018, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إدارة مدينة للبقاء في عالم جليدي قاسٍ.' },
  { id: 'citiesskylines', name: 'Cities: Skylines', genre: 'sim', year: 2015, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة بناء وإدارة مدينة حديثة كاملة.' },
  { id: 'thesims4', name: 'The Sims 4', genre: 'sim', year: 2014, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة حياة شخصيات افتراضية وبناء منازلهم.' },
  { id: 'firewatch', name: 'Firewatch', genre: 'adventure', year: 2016, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة قصصية هادئة لحارس غابات وسط جبال أمريكا.' },
  { id: 'whatremains', name: 'What Remains of Edith Finch', genre: 'adventure', year: 2017, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مجموعة قصص قصيرة غريبة عن أفراد عائلة واحدة.' },
  { id: 'journey', name: 'Journey', genre: 'adventure', year: 2012, age: '+12', platforms: ['PS5', 'PC'], desc: 'مغامرة بصرية هادئة عبر صحراء واسعة بلا حوار.' },

  { id: 'battlefield2042', name: 'Battlefield 2042', genre: 'shooter', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب حروب واسع النطاق بمعارك جماعية ضخمة.' },
  { id: 'rainbow6siege', name: 'Rainbow Six Siege', genre: 'shooter', year: 2015, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب تكتيكي يعتمد على تدمير البيئة وتنسيق الفريق.' },
  { id: 'titanfall2', name: 'Titanfall 2', genre: 'shooter', year: 2016, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب سريع بحركة حرة وروبوتات قتالية ضخمة.' },
  { id: 'destiny2', name: 'Destiny 2', genre: 'shooter', year: 2017, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب فضائي مستمر بعناصر آر بي جي وغنائم.' },
  { id: 'warframe', name: 'Warframe', genre: 'shooter', year: 2013, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب تعاوني بأزياء قتالية خارقة وحركة سريعة.' },
  { id: 'helldivers2', name: 'Helldivers 2', genre: 'shooter', year: 2024, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب تعاوني فكاهي عن جنود يدافعون عن مستعمرات بشرية.' },

  { id: 'xcom2', name: 'XCOM 2', genre: 'strategy', year: 2016, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية بالأدوار عن مقاومة بشرية ضد غزو فضائي.' },
  { id: 'totalwarwarhammer3', name: 'Total War: Warhammer III', genre: 'strategy', year: 2022, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية معارك ضخمة تجمع بين إدارة الحضارات ومعارك حية.' },
  { id: 'crusaderkings3', name: 'Crusader Kings III', genre: 'strategy', year: 2020, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية سلالات حاكمة بأحداث درامية عبر أجيال.' },
  { id: 'footballmanager', name: 'Football Manager 2024', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة إدارة نادي كرة قدم من الألف للياء.' },

  { id: 'pokemonsv', name: 'Pokémon Scarlet & Violet', genre: 'rpg', year: 2022, age: '+7', platforms: ['Switch'], desc: 'مغامرة جمع وتدريب مخلوقات بوكيمون بعالم مفتوح.' },
  { id: 'fireemblemengage', name: 'Fire Emblem Engage', genre: 'strategy', year: 2023, age: '+12', platforms: ['Switch'], desc: 'استراتيجية تكتيكية يابانية بشخصيات وقصص متشعبة.' },
  { id: 'octopathtraveler2', name: 'Octopath Traveler II', genre: 'rpg', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي كلاسيكية بأسلوب بكسل ثلاثي الأبعاد وثماني قصص متوازية.' },
  { id: 'talesofarise', name: 'Tales of Arise', genre: 'rpg', year: 2021, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي يابانية بقتال حركي وقصة عن الحرية.' },
  { id: 'kingdomheartsIII', name: 'Kingdom Hearts III', genre: 'rpg', year: 2019, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مزيج فريد بين عوالم ديزني وقصة أكشن آر بي جي طويلة.' },

  { id: 'smashbros', name: 'Super Smash Bros. Ultimate', genre: 'fighting', year: 2018, age: '+12', platforms: ['Switch'], desc: 'قتال جماعي بشخصيات من عوالم ألعاب نينتندو المختلفة.' },
  { id: 'marioparty', name: 'Mario Party Superstars', genre: 'sim', year: 2021, age: '+3', platforms: ['Switch'], desc: 'ألعاب جماعية مصغّرة تنافسية بأجواء مرحة.' },
  { id: 'animalcrossing', name: 'Animal Crossing: New Horizons', genre: 'sim', year: 2020, age: '+3', platforms: ['Switch'], desc: 'محاكاة حياة هادئة على جزيرة استوائية شخصية.' },
  { id: 'splatoon3', name: 'Splatoon 3', genre: 'shooter', year: 2022, age: '+7', platforms: ['Switch'], desc: 'تصويب جماعي مرح بأسلحة طلاء بدل الرصاص.' },
  { id: 'luigimansion3', name: "Luigi's Mansion 3", genre: 'adventure', year: 2019, age: '+7', platforms: ['Switch'], desc: 'مغامرة لويجي وهو يصطاد الأشباح بمكنسة كهربائية خاصة.' },
  { id: 'kirbyforgotten', name: 'Kirby and the Forgotten Land', genre: 'platformer', year: 2022, age: '+3', platforms: ['Switch'], desc: 'منصات مرحة لكيربي في عالم مهجور غامض.' },
  { id: 'metroiddread', name: 'Metroid Dread', genre: 'platformer', year: 2021, age: '+12', platforms: ['Switch'], desc: 'مغامرة استكشافية فضائية بأسلوب Metroidvania كلاسيكي.' },

  { id: 'halo_infinite', name: 'Halo Infinite', genre: 'shooter', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب فضائي ملحمي يعيد المستكشف الرئيسي لمواجهة تهديد جديد.' },
  { id: 'gearsof5', name: 'Gears 5', genre: 'shooter', year: 2019, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب من منظور الشخص الثالث بأجواء حرب وحشية.' },

  { id: 'wwe2k24', name: 'WWE 2K24', genre: 'sports', year: 2024, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة مصارعة حرة باحترافية عالية للحلبات والمصارعين.' },
  { id: 'eaufc', name: 'EA Sports UFC 5', genre: 'fighting', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة قتال فنون قتالية مختلطة احترافية.' },

  { id: 'gow_original', name: 'God of War (2005)', genre: 'action', year: 2005, age: '+18', platforms: ['PS5'], desc: 'الجزء الأول اللي بدأت فيه ملحمة كريتوس مع آلهة الأساطير اليونانية.' },
  { id: 'gow2', name: 'God of War II', genre: 'action', year: 2007, age: '+18', platforms: ['PS5'], desc: 'استكمال رحلة كريتوس بمعارك أضخم ضد آلهة الأوليمب.' },
  { id: 'gow3', name: 'God of War III', genre: 'action', year: 2010, age: '+18', platforms: ['PS5'], desc: 'خاتمة الثلاثية الأصلية بمواجهة كريتوس النهائية ضد زيوس.' },
  { id: 'mgs', name: 'Metal Gear Solid', genre: 'action', year: 1998, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'لعبة تسلل كلاسيكية أسست لسلسلة ميتال جير الشهيرة.' },
  { id: 'mgs3', name: 'Metal Gear Solid 3: Snake Eater', genre: 'action', year: 2004, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تسلل في الغابات خلال الحرب الباردة.' },
  { id: 'mgs5', name: 'Metal Gear Solid V: The Phantom Pain', genre: 'action', year: 2015, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح للتسلل العسكري بحرية تكتيكية عالية.', summary: 'بيغ بوس يستيقظ من غيبوبة طويلة بعد حادثة دمّرت قاعدته العسكرية.\nيبدأ ببناء قوة عسكرية خاصة جديدة وسط رغبته بالانتقام.\nالعالم بمنتصف حرب باردة مليانة مؤامرات ودول متصارعة.\nعالم مفتوح للتسلل العسكري بحرية تكتيكية عالية.\nقصة تختم فصل مهم من حكاية بيغ بوس الطويلة.' },
  { id: 'ratchetclank', name: 'Ratchet & Clank', genre: 'platformer', year: 2002, age: '+7', platforms: ['PS5'], desc: 'مغامرة منصات فضائية بأسلحة غريبة وثنائي مرح.' },
  { id: 'ratchetriftapart', name: 'Ratchet & Clank: Rift Apart', genre: 'platformer', year: 2021, age: '+7', platforms: ['PS5', 'PC'], desc: 'قفز سريع بين أبعاد موازية بصرياً مبهرة.' },
  { id: 'infamous', name: 'inFamous Second Son', genre: 'action', year: 2014, age: '+16', platforms: ['PS5'], desc: 'عالم مفتوح لبطل يمتلك قوى خارقة بمدينة سياتل.' },
  { id: 'killzone2', name: 'Killzone 2', genre: 'shooter', year: 2009, age: '+16', platforms: ['PS5'], desc: 'تصويب حربي فضائي بأجواء قاتمة ومعارك ضخمة.' },
  { id: 'uncharted2', name: 'Uncharted 2: Among Thieves', genre: 'adventure', year: 2009, age: '+16', platforms: ['PS5'], desc: 'مغامرة نيثان دريك المحبوبة بين الجبال الآسيوية.' },
  { id: 'uncharted3', name: "Uncharted 3: Drake's Deception", genre: 'adventure', year: 2011, age: '+16', platforms: ['PS5'], desc: 'رحلة بحث عن مدينة أسطورية وسط الصحراء.' },
  { id: 'spidermanmilesmorales', name: "Marvel's Spider-Man: Miles Morales", genre: 'action', year: 2020, age: '+12', platforms: ['PS5', 'PC'], desc: 'قصة مستقلة عن مايلز موراليس وهو يتعلم يكون بطلاً خارقاً.' },
  { id: 'ff7og', name: 'Final Fantasy VII', genre: 'rpg', year: 1997, age: '+12', platforms: ['PS5', 'PC'], desc: 'واحدة من أشهر ألعاب الآر بي جي اليابانية على الإطلاق.' },
  { id: 'ff10', name: 'Final Fantasy X', genre: 'rpg', year: 2001, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قصة إيموشنال عن رحلة روحية في عالم سبيرا.' },
  { id: 'crashbandicoot', name: 'Crash Bandicoot N. Sane Trilogy', genre: 'platformer', year: 2017, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة إحياء الثلاثية الكلاسيكية لكراش بانديكوت.' },
  { id: 'crash4', name: "Crash Bandicoot 4: It's About Time", genre: 'platformer', year: 2020, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال حديث لمغامرات كراش بمراحل صعبة ومتنوعة.' },
  { id: 'spyro', name: 'Spyro Reignited Trilogy', genre: 'platformer', year: 2018, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة إحياء مغامرات التنين سبايرو الكلاسيكية.' },
  { id: 'gt_original', name: 'Gran Turismo', genre: 'racing', year: 1997, age: '+3', platforms: ['PS5'], desc: 'اللعبة الأولى اللي أسست لسلسلة محاكاة السباقات الشهيرة.' },
  { id: 'gt2', name: 'Gran Turismo 2', genre: 'racing', year: 1999, age: '+3', platforms: ['PS5'], desc: 'استكمال محاكاة السباقات بعدد سيارات أكبر بكثير.' },
  { id: 'tekken3', name: 'Tekken 3', genre: 'fighting', year: 1998, age: '+12', platforms: ['PS5'], desc: 'من أفضل ألعاب القتال الكلاسيكية وأكثرها توازناً.' },
  { id: 'hp_philosophersstone', name: "Harry Potter and the Philosopher's Stone", genre: 'adventure', year: 2001, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة السنة الأولى لهاري بوتر بمدرسة هوجورتس.' },
  { id: 'stellarblade', name: 'Stellar Blade', genre: 'action', year: 2024, age: '+18', platforms: ['PS5', 'PC'], desc: 'أكشن قتالي سريع بأجواء ما بعد نهاية العالم.' },

  { id: 'halo_ce', name: 'Halo: Combat Evolved', genre: 'shooter', year: 2001, age: '+16', platforms: ['Xbox', 'PC'], desc: 'اللعبة اللي أطلقت سلسلة هالو وميزت جهاز إكس بوكس الأول.' },
  { id: 'halo2', name: 'Halo 2', genre: 'shooter', year: 2004, age: '+16', platforms: ['Xbox', 'PC'], desc: 'استكمال حرب البشر ضد الغزاة الفضائيين بقصة أعمق.' },
  { id: 'halo3', name: 'Halo 3', genre: 'shooter', year: 2007, age: '+16', platforms: ['Xbox', 'PC'], desc: 'خاتمة الثلاثية الأصلية للمستكشف الرئيسي.' },
  { id: 'halo_reach', name: 'Halo: Reach', genre: 'shooter', year: 2010, age: '+16', platforms: ['Xbox', 'PC'], desc: 'قصة عن سقوط كوكب ريتش بمعارك ملحمية.' },
  { id: 'gearsofwar', name: 'Gears of War', genre: 'shooter', year: 2006, age: '+18', platforms: ['Xbox', 'PC'], desc: 'تصويب من منظور الشخص الثالث بأجواء حرب وحشية.' },
  { id: 'gearsofwar2', name: 'Gears of War 2', genre: 'shooter', year: 2008, age: '+18', platforms: ['Xbox'], desc: 'استكمال حرب البشر ضد اللوكاست تحت الأرض.' },
  { id: 'gearsofwar3', name: 'Gears of War 3', genre: 'shooter', year: 2011, age: '+18', platforms: ['Xbox'], desc: 'خاتمة ثلاثية جيرز الأصلية بمعركة أخيرة كبرى.' },
  { id: 'fable', name: 'Fable', genre: 'rpg', year: 2004, age: '+16', platforms: ['Xbox', 'PC'], desc: 'آر بي جي فانتازيا بقرارات أخلاقية تغيّر شكل بطلك.' },
  { id: 'fable2', name: 'Fable II', genre: 'rpg', year: 2008, age: '+16', platforms: ['Xbox'], desc: 'استكمال عالم فانتازيا ألبيون بحرية أكبر بالقرارات.' },
  { id: 'splintercell', name: "Tom Clancy's Splinter Cell", genre: 'action', year: 2002, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تسلل تجسسي بالظل ضد شبكات إرهابية.' },
  { id: 'forza_motorsport', name: 'Forza Motorsport', genre: 'racing', year: 2005, age: '+3', platforms: ['Xbox'], desc: 'محاكاة سباقات احترافية تركز على واقعية القيادة.' },
  { id: 'forzahorizon4', name: 'Forza Horizon 4', genre: 'racing', year: 2018, age: '+3', platforms: ['Xbox', 'PC'], desc: 'سباقات مفتوحة العالم في بريطانيا بفصول متغيرة.' },
  { id: 'sunsetoverdrive', name: 'Sunset Overdrive', genre: 'action', year: 2014, age: '+16', platforms: ['Xbox', 'PC'], desc: 'أكشن ملون وسريع ضد مسوخ نتجت عن مشروب طاقة فاسد.' },
  { id: 'ori_willofwisps', name: 'Ori and the Will of the Wisps', genre: 'platformer', year: 2020, age: '+7', platforms: ['Xbox', 'PC', 'Switch'], desc: 'استكمال مغامرة أوري الجميلة بصرياً وعاطفياً.' },
  { id: 'sea_of_thieves', name: 'Sea of Thieves', genre: 'adventure', year: 2018, age: '+12', platforms: ['Xbox', 'PC', 'PS5'], desc: 'مغامرة قراصنة تعاونية بحرية استكشاف كاملة.' },
  { id: 'starfield', name: 'Starfield', genre: 'rpg', year: 2023, age: '+16', platforms: ['Xbox', 'PC'], desc: 'آر بي جي فضائية ضخمة باستكشاف كواكب متعددة.', summary: 'مستقبل بعيد، البشرية استوطنت الفضاء وأنظمة نجمية متعددة.\nاللاعب ينضم لمنظمة تستكشف الفضاء بحثاً عن آثار غامضة.\nهذي الآثار مرتبطة بلغز أكبر عن أصل الكون نفسه.\nعالم مفتوح ضخم يشمل مئات الكواكب القابلة للاستكشاف.\nحرية كبيرة تبني فيها سفينتك ومسارك الخاص بالفضاء.' },
  { id: 'eacollegefootball', name: 'EA Sports College Football 25', genre: 'sports', year: 2024, age: '+3', platforms: ['PS5', 'Xbox'], desc: 'محاكاة كرة القدم الأمريكية الجامعية باحترافية عالية.' },
  { id: 'codbo6', name: 'Call of Duty: Black Ops 6', genre: 'shooter', year: 2024, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'جزء حديث من سلسلة الحرب العسكرية الشهيرة بقصة تجسسية.' },
  { id: 'codmw3_2023', name: 'Call of Duty: Modern Warfare III', genre: 'shooter', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال قصة الحرب الحديثة بمهام سريعة ومتنوعة.' },

  { id: 'worldofwarcraft', name: 'World of Warcraft', genre: 'rpg', year: 2004, age: '+12', platforms: ['PC'], desc: 'أشهر عالم آر بي جي مستمر أونلاين بتاريخ طويل من التوسعات.' },
  { id: 'eurotrucksim2', name: 'Euro Truck Simulator 2', genre: 'sim', year: 2012, age: '+3', platforms: ['PC'], desc: 'محاكاة قيادة شاحنات نقل عبر مدن أوروبا.' },
  { id: 'halflife', name: 'Half-Life', genre: 'shooter', year: 1998, age: '+18', platforms: ['PC'], desc: 'لعبة أثّرت بصناعة الألعاب بأسلوب سرد القصة أثناء اللعب.' },
  { id: 'counterstrike16', name: 'Counter-Strike 1.6', genre: 'shooter', year: 2000, age: '+18', platforms: ['PC'], desc: 'النسخة الكلاسيكية اللي أسست لتصويب الفرق التنافسي.' },
  { id: 'csgo', name: 'Counter-Strike: Global Offensive', genre: 'shooter', year: 2012, age: '+18', platforms: ['PC'], desc: 'النسخة اللي سبقت CS2 وأصبحت رياضة إلكترونية عالمية.' },
  { id: 'diablo2', name: 'Diablo II', genre: 'rpg', year: 2000, age: '+18', platforms: ['PC'], desc: 'مغامرة قتالية مظلمة أسست لأسلوب جمع الغنائم الشهير.' },
  { id: 'diablo3', name: 'Diablo III', genre: 'rpg', year: 2012, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'استكمال سلسلة دياblo بأسلوب أكثر سلاسة وألوان أوضح.' },
  { id: 'warcraft3', name: 'Warcraft III: Reign of Chaos', genre: 'strategy', year: 2002, age: '+12', platforms: ['PC'], desc: 'استراتيجية أسست لعالم الأساطير اللي بنيت عليه وارلوف كرافت.' },
  { id: 'starcraft2', name: 'StarCraft II', genre: 'strategy', year: 2010, age: '+12', platforms: ['PC'], desc: 'استراتيجية فضائية تنافسية من أعمق ألعاب الرياضات الإلكترونية.' },
  { id: 'sims_original', name: 'The Sims', genre: 'sim', year: 2000, age: '+12', platforms: ['PC'], desc: 'اللعبة الأولى اللي أسست لسلسلة محاكاة الحياة الشهيرة.' },
  { id: 'sims2', name: 'The Sims 2', genre: 'sim', year: 2004, age: '+12', platforms: ['PC'], desc: 'استكمال محاكاة الحياة بشخصيات وأهداف أعمق.' },
  { id: 'sims3', name: 'The Sims 3', genre: 'sim', year: 2009, age: '+12', platforms: ['PC'], desc: 'محاكاة حياة بعالم مفتوح بدون شاشات تحميل بين المنازل.' },
  { id: 'guildwars', name: 'Guild Wars', genre: 'rpg', year: 2005, age: '+12', platforms: ['PC'], desc: 'آر بي جي أونلاين بدون اشتراك شهري، غير مألوف وقت صدوره.' },
  { id: 'guildwars2', name: 'Guild Wars 2', genre: 'rpg', year: 2012, age: '+12', platforms: ['PC'], desc: 'استكمال عالم Guild Wars بنظام معارك ديناميكي.' },
  { id: 'myst', name: 'Myst', genre: 'puzzle', year: 1993, age: '+3', platforms: ['PC'], desc: 'ألغاز استكشافية هادئة في جزيرة غامضة، من أوائل ألعاب الاستكشاف.' },
  { id: 'kingdomcomedeliverance', name: 'Kingdom Come: Deliverance', genre: 'rpg', year: 2018, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي واقعية في أوروبا القرون الوسطى بلا عناصر خيالية.' },
  { id: 'kingdomcomedeliverance2', name: 'Kingdom Come: Deliverance II', genre: 'rpg', year: 2025, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال المغامرة الواقعية بعالم أوسع وتفاصيل أدق.' },
  { id: 'lostark', name: 'Lost Ark', genre: 'rpg', year: 2019, age: '+16', platforms: ['PC'], desc: 'آر بي جي أونلاين بمنظور علوي ومعارك سريعة الإيقاع.' },
  { id: 'crimsondesert', name: 'Crimson Desert', genre: 'action', year: 2026, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة أكشن مفتوحة العالم بقتال وحشي وعالم قاسٍ.' },
  { id: 'blackmythwukong', name: 'Black Myth: Wukong', genre: 'rpg', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة قتالية مستوحاة من أسطورة الملك القرد الصينية.', summary: 'مستوحاة من رواية "رحلة إلى الغرب" الصينية الكلاسيكية وشخصية الملك القرد.\nاللاعب يتحكم بمحارب يشبه الملك القرد برحلة عبر أراضٍ أسطورية.\nيواجه آلهة وشياطين وكائنات مستوحاة من الأساطير الصينية.\nقتال سريع يعتمد على تحولات وقدرات خاصة بالشخصية.\nعالم بصري مذهل مبني على فولكلور صيني عريق.' },
  { id: 'residentevilrequiem', name: 'Resident Evil Requiem', genre: 'horror', year: 2026, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أحدث أجزاء سلسلة رعب البقاء الشهيرة.', summary: 'أحدث أجزاء سلسلة رعب البقاء الشهيرة، بشخصية جديدة اسمها غرايس آشكروفت.\nليون كينيدي يظهر بعد سنوات طويلة بأسلوب لعب مختلف عن السابق.\nالقصة تجمع بين الرعب التقليدي البطيء وعناصر أكشن حديثة.\nأحداث تدور بمكان جديد كلياً بعيد عن أي منطقة سابقة بالسلسلة.\nمن أكثر الألعاب المنتظرة بسلسلة Resident Evil.' },
  { id: 'firstlight007', name: '007 First Light', genre: 'action', year: 2026, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تجسس أكشن بشخصية جيمس بوند في بداياته.' },
  { id: 'sonsoftheforest', name: 'Sons of the Forest', genre: 'sim', year: 2023, age: '+18', platforms: ['PC'], desc: 'بقاء في جزيرة مرعبة مليئة بمخلوقات مفترسة.' },
  { id: 'rust', name: 'Rust', genre: 'sim', year: 2018, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'بقاء جماعي قاسٍ يعتمد على بناء التحالفات والغدر.' },
  { id: 'ark_survival', name: 'ARK: Survival Evolved', genre: 'sim', year: 2017, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'بقاء وسط ديناصورات على جزيرة عصور ما قبل التاريخ.' },
  { id: 'valheim', name: 'Valheim', genre: 'sim', year: 2021, age: '+12', platforms: ['Xbox', 'PC'], desc: 'بقاء وبناء مستوحى من الأساطير الفايكنجية.' },
  { id: 'palworld', name: 'Palworld', genre: 'sim', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'بقاء وجمع مخلوقات بأسلوب فيه عناصر قتال وبناء قواعد.' },
  { id: 'monsterhunterwilds', name: 'Monster Hunter Wilds', genre: 'rpg', year: 2025, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال سلسلة صيد الوحوش بعالم مفتوح متغير الطقس.' },
  { id: 'marathon', name: 'Marathon', genre: 'shooter', year: 2026, age: '+16', platforms: ['PS5', 'PC'], desc: 'تصويب تعاوني بأجواء خيال علمي من صناع Destiny.' },

  { id: 'darksouls1', name: 'Dark Souls', genre: 'rpg', year: 2011, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'اللعبة اللي أسست لأسلوب القتال الصعب المعروف بـ"سولزلايك".' },
  { id: 'darksouls2', name: 'Dark Souls II', genre: 'rpg', year: 2014, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال عالم دارك سولز بمناطق وأعداء جدد.' },
  { id: 'oblivion', name: 'The Elder Scrolls IV: Oblivion', genre: 'rpg', year: 2006, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي مفتوحة العالم بعالم فانتازيا غني بالتفاصيل.' },
  { id: 'morrowind', name: 'The Elder Scrolls III: Morrowind', genre: 'rpg', year: 2002, age: '+12', platforms: ['Xbox', 'PC'], desc: 'عالم مفتوح غريب وفريد أسس لسلسلة إلدر سكرولز الشهيرة.' },
  { id: 'outlast', name: 'Outlast', genre: 'horror', year: 2013, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'رعب بمنظور الشخص الأول داخل مصحة نفسية مهجورة.' },
  { id: 'amnesia', name: 'Amnesia: The Dark Descent', genre: 'horror', year: 2010, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'رعب نفسي بدون قتال، البقاء يعتمد على الاختباء والهروب.' },
  { id: 'deadbydaylight', name: 'Dead by Daylight', genre: 'horror', year: 2016, age: '+18', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'رعب غير متماثل، لاعب قاتل ضد أربعة ناجين.' },
  { id: 'fnaf', name: "Five Nights at Freddy's", genre: 'horror', year: 2014, age: '+12', platforms: ['PC', 'Mobile'], desc: 'رعب بالمراقبة الليلية لمطعم مليء بدمى آلية مخيفة.' },
  { id: 'injustice2', name: 'Injustice 2', genre: 'fighting', year: 2017, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قتال بشخصيات دي سي كوميكس بقصة سينمائية.' },
  { id: 'guiltygearstrive', name: 'Guilty Gear -Strive-', genre: 'fighting', year: 2021, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قتال ياباني بأسلوب رسوم متحركة مميز وموسيقى روك.' },
  { id: 'sf2', name: 'Street Fighter II', genre: 'fighting', year: 1991, age: '+12', platforms: ['PC', 'Switch'], desc: 'اللعبة الكلاسيكية اللي أسست لعصر ألعاب القتال.' },
  { id: 'rayman_legends', name: 'Rayman Legends', genre: 'platformer', year: 2013, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'منصات ملونة ومرحة بتصميم مستويات مبدع.' },
  { id: 'banjo_kazooie', name: 'Banjo-Kazooie', genre: 'platformer', year: 1998, age: '+3', platforms: ['Xbox'], desc: 'منصات كلاسيكية عن دب وطائر يستكشفون عالم سحري.' },
  { id: 'coh', name: 'Company of Heroes', genre: 'strategy', year: 2006, age: '+16', platforms: ['PC'], desc: 'استراتيجية حربية تكتيكية بمعارك الحرب العالمية الثانية.' },
  { id: 'coh2', name: 'Company of Heroes 2', genre: 'strategy', year: 2013, age: '+16', platforms: ['PC'], desc: 'استكمال استراتيجية الحرب بجبهة شرقية قاسية.' },
  { id: 'tetris', name: 'Tetris', genre: 'puzzle', year: 1984, age: '+3', platforms: ['Mobile', 'PC', 'Switch'], desc: 'أشهر لعبة ألغاز بترتيب قطع متساقطة، أسست نوعاً كاملاً.' },
  { id: 'twopointhospital', name: 'Two Point Hospital', genre: 'sim', year: 2018, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'محاكاة إدارة مستشفى بأسلوب فكاهي.' },
  { id: 'planetcoaster', name: 'Planet Coaster', genre: 'sim', year: 2016, age: '+3', platforms: ['PC'], desc: 'محاكاة بناء وإدارة مدينة ملاهي كاملة.' },
  { id: 'fallguys', name: 'Fall Guys', genre: 'platformer', year: 2020, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch', 'Mobile'], desc: 'سباق عقبات جماعي فوضوي وملون بشخصيات لطيفة.' },
  { id: 'overcooked2', name: 'Overcooked! 2', genre: 'sim', year: 2018, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'طبخ تعاوني فوضوي تحت ضغط الوقت مع أصدقائك.' },
  { id: 'roblox', name: 'Roblox', genre: 'sim', year: 2006, age: '+7', platforms: ['PC', 'Mobile', 'Xbox'], desc: 'منصة ألعاب مليئة بتجارب صنعها المستخدمون أنفسهم.' },
  { id: 'nfsmostwanted', name: 'Need for Speed: Most Wanted', genre: 'racing', year: 2005, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'سباقات شوارع كلاسيكية بمطاردات شرطة شهيرة.' },
  { id: 'burnoutparadise', name: 'Burnout Paradise', genre: 'racing', year: 2008, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'سباقات مفتوحة العالم بأسلوب تصادمي عالي السرعة.' },
  { id: 'simcity', name: 'SimCity', genre: 'sim', year: 1989, age: '+3', platforms: ['PC'], desc: 'اللعبة اللي أسست لنوع محاكاة بناء المدن كاملاً.' },
  { id: 'lifeisstrange', name: 'Life is Strange', genre: 'adventure', year: 2015, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'قصة تفاعلية عن فتاة تكتشف قدرتها على التحكم بالزمن.' },
  { id: 'stray', name: 'Stray', genre: 'adventure', year: 2022, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تلعب فيها بدور قطة تستكشف مدينة روبوتات غامضة.' },
  { id: 'slaythespire', name: 'Slay the Spire', genre: 'strategy', year: 2019, age: '+12', platforms: ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile'], desc: 'مزيج ذكي بين ألعاب البطاقات وأسلوب الصعود التدريجي.' },
  { id: 'deadcells', name: 'Dead Cells', genre: 'action', year: 2018, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch', 'Mobile'], desc: 'أكشن منصات سريع بعناصر عشوائية في كل محاولة.' },
  { id: 'hifirush', name: 'Hi-Fi Rush', genre: 'action', year: 2023, age: '+12', platforms: ['Xbox', 'PC', 'PS5'], desc: 'أكشن إيقاعي فيه كل ضربة تتزامن مع الموسيقى.' },
  { id: 'astro_bot', name: 'Astro Bot', genre: 'platformer', year: 2024, age: '+3', platforms: ['PS5'], desc: 'منصات مرحة ومبدعة استغلت حساسات جهاز التحكم بذكاء.' },
  { id: 'returnal', name: 'Returnal', genre: 'shooter', year: 2021, age: '+16', platforms: ['PS5', 'PC'], desc: 'تصويب فضائي بحلقة زمنية متكررة على كوكب غريب.' },
  { id: 'deathloop', name: 'Deathloop', genre: 'shooter', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب إبداعي عن قاتل عالق في يوم يتكرر إلى الأبد.' },
  { id: 'dyinglight2', name: 'Dying Light 2', genre: 'action', year: 2022, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'بقاء وباركور وسط مدينة مليئة بالزومبي.' },
  { id: 'farcry5', name: 'Far Cry 5', genre: 'shooter', year: 2018, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح ضد طائفة متطرفة بولاية أمريكية ريفية.' },
  { id: 'farcry6', name: 'Far Cry 6', genre: 'shooter', year: 2021, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'ثورة مسلحة ضد ديكتاتور في جزيرة استوائية خيالية.' },
  { id: 'divinityos2', name: 'Divinity: Original Sin II', genre: 'rpg', year: 2017, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'آر بي جي تكتيكية عميقة بحرية كبيرة بحل المشاكل.' },
  { id: 'pillarsofeternity', name: 'Pillars of Eternity', genre: 'rpg', year: 2015, age: '+16', platforms: ['PC'], desc: 'آر بي جي كلاسيكية بأسلوب سرد نصي عميق.' },
  { id: 'wasteland3', name: 'Wasteland 3', genre: 'rpg', year: 2020, age: '+18', platforms: ['PC', 'PS5', 'Xbox'], desc: 'آر بي جي تكتيكية في عالم ما بعد نووي قاسٍ.' },
  { id: 'remnant2', name: 'Remnant II', genre: 'shooter', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب تعاوني بعوالم متعددة وأعداء ضخمة.' },
  { id: 'armoredcore6', name: 'Armored Core VI', genre: 'action', year: 2023, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'معارك آليات ضخمة قابلة للتخصيص الكامل.' },
  { id: 'lieofp', name: 'Lies of P', genre: 'rpg', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة صعبة مستوحاة من قصة بينوكيو بأجواء قوطية.' },
  { id: 'lordsofthefallen2023', name: 'Lords of the Fallen', genre: 'rpg', year: 2023, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة قتالية مظلمة بين عالمي الأحياء والموتى.' },
  { id: 'pes2013', name: 'Pro Evolution Soccer 2013', genre: 'sports', year: 2012, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة كرة قدم كلاسيكية كانت منافسة قوية لفيفا.' },
  { id: 'maddennfl24', name: 'Madden NFL 24', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox'], desc: 'محاكاة كرة القدم الأمريكية الاحترافية السنوية.' },
  { id: 'nhl24', name: 'NHL 24', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox'], desc: 'محاكاة هوكي الجليد الاحترافية السنوية.' },
  { id: 'mlbtheshow24', name: 'MLB The Show 24', genre: 'sports', year: 2024, age: '+3', platforms: ['PS5', 'Xbox', 'Switch'], desc: 'محاكاة بيسبول احترافية شاملة.' },
  { id: 'wwe2k23', name: 'WWE 2K23', genre: 'sports', year: 2023, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة مصارعة حرة بأوضاع قصة متنوعة.' },
  { id: 'injustice1', name: 'Injustice: Gods Among Us', genre: 'fighting', year: 2013, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أول جزء من قتال دي سي كوميكس بعالم بديل مظلم.' },
  { id: 'dragonballfighterz', name: 'Dragon Ball FighterZ', genre: 'fighting', year: 2018, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'قتال بشخصيات دراغون بول بأسلوب رسوم متحركة مذهل.' },
  { id: 'granbluefantasyversus', name: 'Granblue Fantasy Versus', genre: 'fighting', year: 2020, age: '+12', platforms: ['PS5', 'PC'], desc: 'قتال ياباني بشخصيات عالم Granblue Fantasy.' },
  { id: 'persona4golden', name: 'Persona 4 Golden', genre: 'rpg', year: 2012, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'قصة طلاب يحققون بجرائم غامضة بعالم موازٍ.' },
  { id: 'xenobladechronicles3', name: 'Xenoblade Chronicles 3', genre: 'rpg', year: 2022, age: '+12', platforms: ['Switch'], desc: 'آر بي جي ملحمية بعالم ضخم ومعارك جماعية.' },
  { id: 'triangle_strategy', name: 'Triangle Strategy', genre: 'strategy', year: 2022, age: '+12', platforms: ['Switch'], desc: 'استراتيجية تكتيكية بقرارات سياسية تغيّر مسار القصة.' },
  { id: 'advancewars', name: 'Advance Wars 1+2: Re-Boot Camp', genre: 'strategy', year: 2023, age: '+7', platforms: ['Switch'], desc: 'استراتيجية عسكرية كلاسيكية بطابع كرتوني.' },
  { id: 'pikmin4', name: 'Pikmin 4', genre: 'strategy', year: 2023, age: '+7', platforms: ['Switch'], desc: 'قيادة مخلوقات صغيرة لحل الألغاز وجمع الموارد.' },
  { id: 'supermariobros_wonder', name: 'Super Mario Bros. Wonder', genre: 'platformer', year: 2023, age: '+3', platforms: ['Switch'], desc: 'منصات كلاسيكية بعناصر سحرية غريبة وجديدة كلياً.' },
  { id: 'donkeykong_tf', name: 'Donkey Kong Country: Tropical Freeze', genre: 'platformer', year: 2014, age: '+3', platforms: ['Switch'], desc: 'منصات صعبة وممتعة بأجواء جزر استوائية متجمدة.' },
  { id: 'streetsofrage4', name: 'Streets of Rage 4', genre: 'action', year: 2020, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'إحياء لأسلوب القتال الجانبي الكلاسيكي بفن مرسوم يدوياً.' },
  { id: 'teenagemutant_shredders', name: "Teenage Mutant Ninja Turtles: Shredder's Revenge", genre: 'action', year: 2022, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'قتال جانبي كلاسيكي بأسلوب رسوم الثمانينات لسلاحف النينجا.' },

  { id: 'baldursgate1', name: "Baldur's Gate", genre: 'rpg', year: 1998, age: '+12', platforms: ['PC'], desc: 'آر بي جي كلاسيكية أسست لسلسلة بالدرز غيت بقواعد D&D.' },
  { id: 'baldursgate2', name: "Baldur's Gate II: Shadows of Amn", genre: 'rpg', year: 2000, age: '+12', platforms: ['PC'], desc: 'يعتبرها كثيرون أفضل آر بي جي كلاسيكية على الإطلاق.' },
  { id: 'dragonsdogma2', name: "Dragon's Dogma 2", genre: 'rpg', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة فانتازيا ضخمة بمعارك تسلق الوحوش الملحمية.', summary: 'اللاعب يلعب دور "المستدعى"، شخص فقد قلبه لتنين وحصل على قوى خاصة.\nيرافقه "التابعون"، شخصيات مساعدة يمكن تخصيصها بأسلوب قتال مختلف.\nعالم فانتازيا ضخم مليان وحوش أسطورية ضخمة تتسلقها أثناء القتال.\nمهمة اللاعب تتضح تدريجياً وترتبط بمصير العالم نفسه.\nقتال ديناميكي يعتمد على التعاون مع التابعين.' },
  { id: 'ff16', name: 'Final Fantasy XVI', genre: 'rpg', year: 2023, age: '+18', platforms: ['PS5', 'PC'], desc: 'آر بي جي أكشن ملحمية بقصة سياسية مظلمة ومعارك تنانين.', summary: 'عالم "فاليشيا" مقسّم لممالك تتصارع على السيطرة باستخدام أشخاص يتحكمون بعمالقة أسطورية.\nكلايف روزفيلد يبدأ رحلة انتقام بعد حادثة مأساوية بعائلته.\nالقصة سياسية مظلمة مليانة خيانات وتحالفات متغيرة.\nمعارك ضخمة بين عمالقة أسطورية جزء مهم من القصة.\nأسلوب قتال حركي مختلف عن أجزاء السلسلة السابقة.' },
  { id: 'persona3reload', name: 'Persona 3 Reload', genre: 'rpg', year: 2024, age: '+16', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'إعادة صنع لجزء بيرسونا المؤثر عن الحياة والموت.' },
  { id: 'talesofvesperia', name: 'Tales of Vesperia', genre: 'rpg', year: 2008, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'آر بي جي يابانية بقتال حركي وفريق شخصيات مميز.' },
  { id: 'ninokuni2', name: 'Ni no Kuni II: Revenant Kingdom', genre: 'rpg', year: 2018, age: '+12', platforms: ['PS5', 'PC'], desc: 'آر بي جي بأسلوب رسوم استوديو غيبلي وبناء مملكة.' },
  { id: 'octopathtraveler', name: 'Octopath Traveler', genre: 'rpg', year: 2018, age: '+12', platforms: ['Switch', 'PC'], desc: 'آر بي جي كلاسيكية بأسلوب بكسل ثلاثي الأبعاد وثماني قصص.' },
  { id: 'bravelydefault2', name: 'Bravely Default II', genre: 'rpg', year: 2021, age: '+12', platforms: ['Switch'], desc: 'آر بي جي يابانية كلاسيكية بنظام وظائف متعدد.' },
  { id: 'xenobladechronicles1', name: 'Xenoblade Chronicles', genre: 'rpg', year: 2010, age: '+12', platforms: ['Switch'], desc: 'آر بي جي ملحمية تدور أحداثها فوق جسدي إلهين عملاقين.' },
  { id: 'xenobladechronicles2', name: 'Xenoblade Chronicles 2', genre: 'rpg', year: 2017, age: '+12', platforms: ['Switch'], desc: 'استكمال عالم زينوبليد بأسلحة حية ومعارك جماعية.' },
  { id: 'fe_threehouses', name: 'Fire Emblem: Three Houses', genre: 'strategy', year: 2019, age: '+12', platforms: ['Switch'], desc: 'استراتيجية تكتيكية بعناصر إدارة أكاديمية عسكرية.' },
  { id: 'pokemonswordshield', name: 'Pokémon Sword & Shield', genre: 'rpg', year: 2019, age: '+7', platforms: ['Switch'], desc: 'مغامرة بوكيمون في منطقة مستوحاة من بريطانيا.' },
  { id: 'pokemonbdsp', name: 'Pokémon Brilliant Diamond & Shining Pearl', genre: 'rpg', year: 2021, age: '+7', platforms: ['Switch'], desc: 'إعادة صنع لجزء بوكيمون كلاسيكي بمنطقة سنو.' },
  { id: 'chronotrigger', name: 'Chrono Trigger', genre: 'rpg', year: 1995, age: '+7', platforms: ['PC', 'Mobile'], desc: 'من أعظم ألعاب الآر بي جي الكلاسيكية بسفر عبر الزمن.' },
  { id: 'earthbound', name: 'EarthBound', genre: 'rpg', year: 1994, age: '+7', platforms: ['Switch'], desc: 'آر بي جي غريبة وفريدة بأجواء عصرية بدل الفانتازيا التقليدية.' },
  { id: 'undertale', name: 'Undertale', genre: 'rpg', year: 2015, age: '+7', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'آر بي جي مستقلة مشهورة بقصتها المؤثرة وخياراتها الأخلاقية.' },
  { id: 'hogwartslegacy', name: 'Hogwarts Legacy', genre: 'rpg', year: 2023, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة عالم مفتوح داخل مدرسة هوجورتس للسحر.', summary: 'اللاعب يلتحق بمدرسة هوجورتس للسحر بفترة زمنية قبل أحداث هاري بوتر بكثير.\nيكتشف تدريجياً موهبة سحرية نادرة ومرتبطة بسر قديم خطير.\nيتنقل بين دروس السحر ومغامرات خارج المدرسة بعالم مفتوح.\nيقابل شخصيات ووحوش سحرية مألوفة من عالم هاري بوتر.\nحرية كبيرة تختار فيها بيتك السحري وأسلوب لعبك.' },

  { id: 'mariotennisaces', name: 'Mario Tennis Aces', genre: 'sports', year: 2018, age: '+3', platforms: ['Switch'], desc: 'تنس مرح بشخصيات ماريو وقدرات خاصة.' },
  { id: 'mariogolfsuperrush', name: 'Mario Golf: Super Rush', genre: 'sports', year: 2021, age: '+3', platforms: ['Switch'], desc: 'غولف فكاهي بشخصيات عالم ماريو وأوضاع سريعة.' },
  { id: 'luigimansion2', name: "Luigi's Mansion 2 HD", genre: 'adventure', year: 2024, age: '+7', platforms: ['Switch'], desc: 'مغامرة لويجي في صيد الأشباح عبر قصور متعددة.' },
  { id: 'papermario_ttyd', name: 'Paper Mario: The Thousand-Year Door', genre: 'rpg', year: 2004, age: '+3', platforms: ['Switch'], desc: 'آر بي جي فكاهية بأسلوب فني ورقي مميز.' },
  { id: 'metroidprime', name: 'Metroid Prime', genre: 'platformer', year: 2002, age: '+12', platforms: ['Switch'], desc: 'مغامرة فضائية استكشافية بمنظور الشخص الأول.' },
  { id: 'metroidprimeremastered', name: 'Metroid Prime Remastered', genre: 'platformer', year: 2023, age: '+12', platforms: ['Switch'], desc: 'إعادة إحياء بصرية لكلاسيكية استكشاف الفضاء.' },
  { id: 'kidicarusuprising', name: 'Kid Icarus: Uprising', genre: 'shooter', year: 2012, age: '+7', platforms: ['Switch'], desc: 'تصويب فضائي فكاهي بقصة أساطير إغريقية.' },
  { id: 'starfox64', name: 'Star Fox 64', genre: 'shooter', year: 1997, age: '+3', platforms: ['Switch'], desc: 'تصويب فضائي كلاسيكي بمركبات وطاقم حيوانات.' },
  { id: 'fzero_gx', name: 'F-Zero GX', genre: 'racing', year: 2003, age: '+7', platforms: ['Switch'], desc: 'سباقات مركبات مستقبلية فائقة السرعة.' },

  { id: 'katanazero', name: 'Katana Zero', genre: 'action', year: 2019, age: '+18', platforms: ['PC', 'Switch'], desc: 'أكشن سريع بأسلوب بكسل وقصة نيو-نوار غامضة.' },
  { id: 'hyperlightdrifter', name: 'Hyper Light Drifter', genre: 'action', year: 2016, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'أكشن بكسلي بصري بعالم ما بعد كارثة غامض.' },
  { id: 'blasphemous', name: 'Blasphemous', genre: 'platformer', year: 2019, age: '+18', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'منصات صعبة بأجواء دينية مظلمة وفن بكسل مفصّل.' },
  { id: 'enderlilies', name: 'Ender Lilies: Quietus of the Knights', genre: 'platformer', year: 2021, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'مغامرة استكشافية حزينة بفن رسم مائي جميل.' },
  { id: 'saltandsanctuary', name: 'Salt and Sanctuary', genre: 'rpg', year: 2016, age: '+16', platforms: ['PC', 'PS5', 'Switch'], desc: 'مزيج بين أسلوب سولزلايك ومنصات ثنائية الأبعاد.' },
  { id: 'enterthegungeon', name: 'Enter the Gungeon', genre: 'action', year: 2016, age: '+12', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'تصويب روغلايك عن مطاردين يبحثون عن سلاح يمحو الماضي.' },
  { id: 'riskofrain2', name: 'Risk of Rain 2', genre: 'action', year: 2020, age: '+12', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'أكشن روغلايك ثلاثي الأبعاد بصعوبة تتصاعد مع الوقت.' },
  { id: 'noita', name: 'Noita', genre: 'action', year: 2020, age: '+16', platforms: ['PC'], desc: 'روغلايك فيه كل بكسل بالعالم يتفاعل فيزيائياً.' },
  { id: 'spelunky2', name: 'Spelunky 2', genre: 'platformer', year: 2020, age: '+7', platforms: ['PC', 'PS5'], desc: 'استكشاف كهوف عشوائي صعب بأسلوب روغلايك كلاسيكي.' },
  { id: 'intothebreach', name: 'Into the Breach', genre: 'strategy', year: 2018, age: '+7', platforms: ['PC', 'Switch'], desc: 'استراتيجية تكتيكية مصغّرة بمعارك محسوبة كل خطوة.' },
  { id: 'ftl', name: 'FTL: Faster Than Light', genre: 'strategy', year: 2012, age: '+7', platforms: ['PC', 'Mobile'], desc: 'إدارة سفينة فضائية عبر رحلة محفوفة بالمخاطر.' },
  { id: 'darkestdungeon', name: 'Darkest Dungeon', genre: 'rpg', year: 2016, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'آر بي جي قاتمة تركز على الصحة النفسية لأبطالك أثناء الزحف.' },
  { id: 'darkestdungeon2', name: 'Darkest Dungeon II', genre: 'rpg', year: 2023, age: '+16', platforms: ['PC', 'PS5'], desc: 'استكمال أجواء الرعب النفسي بأسلوب رحلة على عربة.' },

  { id: 'xcom_eu', name: 'XCOM: Enemy Unknown', genre: 'strategy', year: 2012, age: '+16', platforms: ['PC', 'PS5', 'Xbox'], desc: 'استراتيجية بالأدوار عن مقاومة بشرية أولى ضد الفضائيين.' },
  { id: 'homeworld', name: 'Homeworld', genre: 'strategy', year: 1999, age: '+12', platforms: ['PC'], desc: 'استراتيجية فضائية ثلاثية الأبعاد كلاسيكية ومؤثرة.' },
  { id: 'cnc_generals', name: 'Command & Conquer: Generals', genre: 'strategy', year: 2003, age: '+16', platforms: ['PC'], desc: 'استراتيجية عسكرية حديثة بثلاث فصائل متنوعة.' },
  { id: 'cnc_redalert2', name: 'Command & Conquer: Red Alert 2', genre: 'strategy', year: 2000, age: '+12', platforms: ['PC'], desc: 'استراتيجية بديلة للتاريخ بأجواء حرب باردة فكاهية.' },
  { id: 'starcraft_og', name: 'StarCraft', genre: 'strategy', year: 1998, age: '+12', platforms: ['PC'], desc: 'استراتيجية فضائية أسست لمشهد الرياضات الإلكترونية الكوري.' },
  { id: 'warcraft2', name: 'Warcraft II: Tides of Darkness', genre: 'strategy', year: 1995, age: '+12', platforms: ['PC'], desc: 'استراتيجية كلاسيكية وضعت أسس عالم وارلوف كرافت.' },
  { id: 'ageofmythology', name: 'Age of Mythology', genre: 'strategy', year: 2002, age: '+12', platforms: ['PC'], desc: 'استراتيجية أساطير إغريقية ومصرية ونوردية.' },
  { id: 'riseofnations', name: 'Rise of Nations', genre: 'strategy', year: 2003, age: '+12', platforms: ['PC'], desc: 'استراتيجية تجمع بين إدارة العصور والمعارك الكبرى.' },
  { id: 'rometotalwar', name: 'Rome: Total War', genre: 'strategy', year: 2004, age: '+16', platforms: ['PC'], desc: 'استراتيجية معارك ضخمة تجمع إدارة الإمبراطورية بمعارك حية.' },
  { id: 'totalwarshogun2', name: 'Total War: Shogun 2', genre: 'strategy', year: 2011, age: '+16', platforms: ['PC'], desc: 'استراتيجية يابانية إقطاعية بمعارك ساموراي ملحمية.' },
  { id: 'totalwar3kingdoms', name: 'Total War: Three Kingdoms', genre: 'strategy', year: 2019, age: '+16', platforms: ['PC'], desc: 'استراتيجية صينية تاريخية بشخصيات وقادة أسطوريين.' },
  { id: 'anno1800', name: 'Anno 1800', genre: 'strategy', year: 2019, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية بناء إمبراطورية اقتصادية بالعصر الصناعي.' },
  { id: 'frostpunk2', name: 'Frostpunk 2', genre: 'strategy', year: 2024, age: '+16', platforms: ['PC'], desc: 'استكمال إدارة مدينة البقاء بعالم جليدي أوسع وأعقد.' },

  { id: 'jedifallenorder', name: 'Star Wars Jedi: Fallen Order', genre: 'action', year: 2019, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة فارس جيداي ناجٍ يهرب من الإمبراطورية.' },
  { id: 'jedisurvivor', name: 'Star Wars Jedi: Survivor', genre: 'action', year: 2023, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال قصة كال كيستس بعد سنوات من الاختباء.' },
  { id: 'battlefront2_sw', name: 'Star Wars Battlefront II', genre: 'shooter', year: 2017, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب جماعي بمعارك بريّة وفضائية في عالم ستار وورز.' },
  { id: 'lego_skywalker', name: 'LEGO Star Wars: The Skywalker Saga', genre: 'adventure', year: 2022, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'مغامرة فكاهية تغطي كل أفلام ستار وورز التسعة.' },
  { id: 'guardiansofgalaxy', name: "Marvel's Guardians of the Galaxy", genre: 'action', year: 2021, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة أكشن فكاهية بقصة سينمائية وموسيقى كلاسيكية.' },
  { id: 'midnightsuns', name: "Marvel's Midnight Suns", genre: 'strategy', year: 2022, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استراتيجية بطاقات تكتيكية بأبطال مارفل وقوى خارقة.' },
  { id: 'marvelavengers', name: "Marvel's Avengers", genre: 'action', year: 2020, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أكشن جماعي بأبطال مارفل الخارقين ضد تهديد عالمي.' },
  { id: 'batmanarkhamasylum', name: 'Batman: Arkham Asylum', genre: 'action', year: 2009, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'اللعبة اللي أسست لأسلوب قتال باتمان الشهير "فريفلو".' },
  { id: 'batmanarkhamcity', name: 'Batman: Arkham City', genre: 'action', year: 2011, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال مغامرات باتمان بعالم مفتوح أوسع.' },
  { id: 'shadowofmordor', name: 'Middle-earth: Shadow of Mordor', genre: 'action', year: 2014, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'أكشن في عالم سيد الخواتم بنظام أعداء يتذكرونك.' },
  { id: 'shadowofwar', name: 'Middle-earth: Shadow of War', genre: 'action', year: 2017, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'استكمال نظام الأعداء الديناميكي بجيش تبنيه بنفسك.' },
  { id: 'princeofpersia_sands', name: 'Prince of Persia: The Sands of Time', genre: 'platformer', year: 2003, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تسلق وأكواب زمن كلاسيكية أثّرت بألعاب كثيرة.' },
  { id: 'princeofpersia_lostcrown', name: 'Prince of Persia: The Lost Crown', genre: 'platformer', year: 2024, age: '+12', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'عودة السلسلة بأسلوب منصات Metroidvania حديث.' },

  { id: 'away_out', name: 'A Way Out', genre: 'adventure', year: 2018, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تعاونية إجبارية لشخصين عن هروب من السجن.' },
  { id: 'unravel', name: 'Unravel', genre: 'platformer', year: 2016, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'منصات هادئة تلعب بدور مخلوق مصنوع من خيط صوف.' },
  { id: 'littlebigplanet', name: 'LittleBigPlanet', genre: 'platformer', year: 2008, age: '+3', platforms: ['PS5'], desc: 'منصات إبداعية تسمح للاعبين بتصميم مستوياتهم الخاصة.' },
  { id: 'abzu', name: 'ABZU', genre: 'adventure', year: 2016, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'استكشاف تحت الماء هادئ وبصري مليء بالحياة البحرية.' },
  { id: 'gris', name: 'Gris', genre: 'platformer', year: 2018, age: '+3', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'منصات فنية مؤثرة عن الحزن والتعافي بألوان مائية.' },
  { id: 'kentuckyroutezero', name: 'Kentucky Route Zero', genre: 'adventure', year: 2013, age: '+12', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'مغامرة سريالية غامضة على طريق سحري في كنتاكي.' },
  { id: 'returnoftheobradinn', name: 'Return of the Obra Dinn', genre: 'puzzle', year: 2018, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'لغز تحقيق بصري أبيض وأسود عن سفينة غامضة مهجورة.' },
  { id: 'goldenidol', name: 'The Case of the Golden Idol', genre: 'puzzle', year: 2022, age: '+16', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'ألغاز تحقيق في جرائم غامضة عبر لوحات ثابتة.' },
  { id: 'herstory', name: 'Her Story', genre: 'puzzle', year: 2015, age: '+16', platforms: ['PC', 'Mobile'], desc: 'لغز تحقيق فيديوهات حقيقية عن قضية غامضة.' },
  { id: 'tacoma', name: 'Tacoma', genre: 'adventure', year: 2017, age: '+12', platforms: ['PC', 'PS5', 'Xbox'], desc: 'مغامرة استكشافية على محطة فضائية مهجورة.' },
  { id: 'ethancarter', name: 'The Vanishing of Ethan Carter', genre: 'adventure', year: 2014, age: '+16', platforms: ['PC', 'PS5', 'Xbox'], desc: 'مغامرة تحقيق غامضة بأسلوب واقعي بصرياً.' },
  { id: 'layersoffear', name: 'Layers of Fear', genre: 'horror', year: 2016, age: '+18', platforms: ['PC', 'PS5', 'Xbox', 'Switch'], desc: 'رعب نفسي داخل استوديو رسام مضطرب يتغير باستمرار.' },
  { id: 'visage', name: 'Visage', genre: 'horror', year: 2020, age: '+18', platforms: ['PC', 'PS5', 'Xbox'], desc: 'رعب منزلي بطيء الإيقاع ومقلق نفسياً.' },
  { id: 'phasmophobia', name: 'Phasmophobia', genre: 'horror', year: 2020, age: '+16', platforms: ['PC'], desc: 'صيد أشباح تعاوني بمعدات تحقيق خارقة للطبيعة.' },
  { id: 'lethalcompany', name: 'Lethal Company', genre: 'horror', year: 2023, age: '+16', platforms: ['PC'], desc: 'جمع خردة تعاوني في كواكب مهجورة مليئة بمخلوقات غريبة.' },

  { id: 'humanfallflat', name: 'Human: Fall Flat', genre: 'puzzle', year: 2016, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch', 'Mobile'], desc: 'ألغاز فيزيائية فوضوية بشخصية طرية التحكم.' },
  { id: 'goatsimulator', name: 'Goat Simulator', genre: 'sim', year: 2014, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة فوضوية وساخرة للعب بدور ماعز مدمرة.' },
  { id: 'untitledgoosegame', name: 'Untitled Goose Game', genre: 'puzzle', year: 2019, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'ألغاز فكاهية عن إوزة مزعجة تخرب قرية هادئة.' },
  { id: 'movingout', name: 'Moving Out', genre: 'sim', year: 2020, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'نقل أثاث تعاوني فوضوي تحت ضغط الوقت.' },
  { id: 'powerwashsimulator', name: 'PowerWash Simulator', genre: 'sim', year: 2022, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'محاكاة تنظيف مريحة ومسلية بغسالة ضغط عالي.' },
  { id: 'houseflipper', name: 'House Flipper', genre: 'sim', year: 2018, age: '+3', platforms: ['PS5', 'Xbox', 'PC', 'Switch'], desc: 'محاكاة تجديد وبيع منازل مهملة.' },
  { id: 'farmingsimulator22', name: 'Farming Simulator 22', genre: 'sim', year: 2021, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة زراعة شاملة بمعدات وآلات حقيقية.' },
  { id: 'americantrucksim', name: 'American Truck Simulator', genre: 'sim', year: 2016, age: '+3', platforms: ['PC'], desc: 'محاكاة قيادة شاحنات عبر ولايات أمريكا.' },
  { id: 'msfs', name: 'Microsoft Flight Simulator', genre: 'sim', year: 2020, age: '+3', platforms: ['PC', 'Xbox'], desc: 'محاكاة طيران واقعية تغطي كوكب الأرض بالكامل تقريباً.' },

  { id: 'dirtrally2', name: 'DiRT Rally 2.0', genre: 'racing', year: 2019, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة راليات واقعية بطرق وعرة وصعبة.' },
  { id: 'wrcgenerations', name: 'WRC Generations', genre: 'racing', year: 2022, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة بطولة العالم للراليات الرسمية.' },
  { id: 'f124', name: 'F1 24', genre: 'racing', year: 2024, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة رسمية لبطولة فورمولا ١ السنوية.' },
  { id: 'motogp24', name: 'MotoGP 24', genre: 'racing', year: 2024, age: '+3', platforms: ['PS5', 'Xbox', 'PC'], desc: 'محاكاة رسمية لسباقات الدراجات النارية الاحترافية.' },
  { id: 'trackmania', name: 'Trackmania', genre: 'racing', year: 2020, age: '+3', platforms: ['PC'], desc: 'سباقات مضمار قصيرة تنافسية على أفضل توقيت.' },
  { id: 'wreckfest', name: 'Wreckfest', genre: 'racing', year: 2018, age: '+7', platforms: ['PS5', 'Xbox', 'PC'], desc: 'سباقات تصادمية مليئة بالفوضى وتدمير السيارات.' },

  { id: 'justcause4', name: 'Just Cause 4', genre: 'action', year: 2018, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح فوضوي مليء بالانفجارات والقفز الحر.' },
  { id: 'saintsrow4', name: 'Saints Row IV', genre: 'action', year: 2013, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح ساخر بقوى خارقة وأسلحة غريبة.' },
  { id: 'watchdogs2', name: 'Watch Dogs 2', genre: 'action', year: 2016, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'قرصنة واختراق أنظمة في مدينة سان فرانسيسكو مفتوحة.' },
  { id: 'watchdogslegion', name: 'Watch Dogs: Legion', genre: 'action', year: 2020, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'عالم مفتوح فريد تقدر تلعب بأي شخصية تشوفها بالشارع.' },

  { id: 'honkaistarrail', name: 'Honkai: Star Rail', genre: 'rpg', year: 2023, age: '+12', platforms: ['PS5', 'PC', 'Mobile'], desc: 'آر بي جي بالأدوار بأسلوب أنمي وقصة فضائية بين النجوم.' },
  { id: 'wutheringwaves', name: 'Wuthering Waves', genre: 'rpg', year: 2024, age: '+12', platforms: ['PS5', 'PC', 'Mobile'], desc: 'عالم مفتوح أنمي بقتال حركي سريع وحرية استكشاف عالية.' },
  { id: 'zenlesszonezero', name: 'Zenless Zone Zero', genre: 'rpg', year: 2024, age: '+12', platforms: ['PS5', 'PC', 'Mobile'], desc: 'آر بي جي حضرية بقتال سريع وأسلوب بصري عصري.' },
  { id: 'towoffantasy', name: 'Tower of Fantasy', genre: 'rpg', year: 2022, age: '+12', platforms: ['PC', 'Mobile'], desc: 'عالم مفتوح خيال علمي بجمع أسلحة وشخصيات.' },
  { id: 'diabloimmortal', name: 'Diablo Immortal', genre: 'rpg', year: 2022, age: '+16', platforms: ['PC', 'Mobile'], desc: 'نسخة موبايل من عالم دياblo القاتم بأسلوب جمع غنائم.' },
  { id: 'marvelsnap', name: 'Marvel Snap', genre: 'strategy', year: 2022, age: '+12', platforms: ['PC', 'Mobile'], desc: 'لعبة بطاقات سريعة بشخصيات مارفل وجولات قصيرة جداً.' },
  { id: 'teamfighttactics', name: 'Teamfight Tactics', genre: 'strategy', year: 2019, age: '+12', platforms: ['PC', 'Mobile'], desc: 'استراتيجية شطرنج تلقائي بشخصيات League of Legends.' },
  { id: 'hearthstone', name: 'Hearthstone', genre: 'strategy', year: 2014, age: '+12', platforms: ['PC', 'Mobile'], desc: 'لعبة بطاقات استراتيجية بشخصيات عالم Warcraft.' },
  { id: 'legendsofruneterra', name: 'Legends of Runeterra', genre: 'strategy', year: 2020, age: '+12', platforms: ['PC', 'Mobile'], desc: 'لعبة بطاقات استراتيجية بأبطال League of Legends.' },
  { id: 'mtgarena', name: 'Magic: The Gathering Arena', genre: 'strategy', year: 2019, age: '+12', platforms: ['PC', 'Mobile'], desc: 'النسخة الرقمية من أعرق لعبة بطاقات استراتيجية بالعالم.' },
  { id: 'yugioh_masterduel', name: 'Yu-Gi-Oh! Master Duel', genre: 'strategy', year: 2022, age: '+7', platforms: ['PS5', 'Xbox', 'PC', 'Switch', 'Mobile'], desc: 'النسخة الرقمية الرسمية للعبة بطاقات يوغي أوه الشهيرة.' },
  { id: 'codmobile', name: 'Call of Duty: Mobile', genre: 'shooter', year: 2019, age: '+16', platforms: ['Mobile'], desc: 'نسخة موبايل من تصويب Call of Duty بخرائط من السلسلة.' },
  { id: 'eafcmobile', name: 'EA Sports FC Mobile', genre: 'sports', year: 2023, age: '+3', platforms: ['Mobile'], desc: 'نسخة موبايل من محاكاة كرة القدم الشهيرة.' },
  { id: 'asphalt9', name: 'Asphalt 9: Legends', genre: 'racing', year: 2018, age: '+3', platforms: ['Mobile', 'PC'], desc: 'سباقات آركيد سريعة وسيارات فاخرة على الموبايل.' },
  { id: 'plantsvszombies', name: 'Plants vs. Zombies', genre: 'strategy', year: 2009, age: '+3', platforms: ['PC', 'Mobile'], desc: 'دفاع أبراج فكاهي بنباتات ضد غزو الزومبي.' },
  { id: 'plantsvszombies2', name: 'Plants vs. Zombies 2', genre: 'strategy', year: 2013, age: '+3', platforms: ['Mobile'], desc: 'استكمال دفاع النباتات عبر حقب زمنية مختلفة.' },
  { id: 'angrybirds', name: 'Angry Birds', genre: 'puzzle', year: 2009, age: '+3', platforms: ['Mobile'], desc: 'قذف طيور غاضبة لتدمير حصون الخنازير، أشهر لعبة موبايل قديمة.' },
  { id: 'subwaysurfers', name: 'Subway Surfers', genre: 'platformer', year: 2012, age: '+3', platforms: ['Mobile'], desc: 'جري بلا نهاية على قضبان قطار هرباً من شرطي غاضب.' },
  { id: 'candycrush', name: 'Candy Crush Saga', genre: 'puzzle', year: 2012, age: '+3', platforms: ['Mobile'], desc: 'مطابقة حلوى ملونة، من أنجح ألعاب الموبايل تاريخياً.' },
  { id: 'coinmaster', name: 'Coin Master', genre: 'sim', year: 2016, age: '+12', platforms: ['Mobile'], desc: 'عجلة حظ وبناء قرى وغزو قرى لاعبين آخرين.' },

  { id: 'splitfiction', name: 'Split Fiction', genre: 'adventure', year: 2025, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'مغامرة تعاونية إجبارية لشخصين من صناع It Takes Two.' },
  { id: 'avowed', name: 'Avowed', genre: 'rpg', year: 2025, age: '+16', platforms: ['Xbox', 'PC'], desc: 'آر بي جي فانتازيا بمنظور الشخص الأول في عالم Pillars of Eternity.' },
  { id: 'doom_thedarkages', name: 'Doom: The Dark Ages', genre: 'shooter', year: 2025, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب وحشي بأجواء العصور الوسطى وأسلحة ثقيلة جديدة.' },
  { id: 'deathstranding2', name: 'Death Stranding 2: On the Beach', genre: 'adventure', year: 2025, age: '+18', platforms: ['PS5'], desc: 'استكمال رحلة سام بورتر في عالم ما بعد الانفصال.' },
  { id: 'ghostofyotei', name: 'Ghost of Yōtei', genre: 'action', year: 2025, age: '+18', platforms: ['PS5'], desc: 'مغامرة ساموراي جديدة من صناع Ghost of Tsushima.' },
  { id: 'borderlands4', name: 'Borderlands 4', genre: 'shooter', year: 2025, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب-آر بي جي فكاهي بملايين الأسلحة العشوائية.' },
  { id: 'mgsdelta', name: 'Metal Gear Solid Delta: Snake Eater', genre: 'action', year: 2025, age: '+18', platforms: ['PS5', 'Xbox', 'PC'], desc: 'إعادة صنع كاملة لكلاسيكية ميتال جير سوليد الثالثة.' },
  { id: 'eldenringnightreign', name: 'Elden Ring Nightreign', genre: 'rpg', year: 2025, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تجربة تعاونية مستقلة داخل عالم Elden Ring بجولات سريعة.' },
  { id: 'clairobscur', name: 'Clair Obscur: Expedition 33', genre: 'rpg', year: 2025, age: '+16', platforms: ['PS5', 'Xbox', 'PC'], desc: 'آر بي جي فرنسية بقتال بالأدوار وقصة فنية مؤثرة.' },
  { id: 'splitgate2', name: 'Splitgate 2', genre: 'shooter', year: 2025, age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: 'تصويب تنافسي بوابات انتقال فيزيائية مستوحى من Portal.' },
];

const DEMO_USERS = {
  'سلطان': { gta5: 5, rdr2: 5, gow2018: 5, codmw2: 4, warzone: 4, apex: 4, cs2: 5, ghost: 5, tlou2: 4, hades: 4 },
  'نوره_الفن': { witcher3: 5, eldenring: 4, bg3: 5, persona5: 5, zelda_botw: 5, zelda_totk: 5, horizon: 4, ff7remake: 5, genshin: 3, ittakestwo: 4 },
  'فيصل_سبيد': { fc24: 5, fc25: 5, nba2k24: 4, rocketleague: 5, forzahorizon5: 5, gt7: 4, mariokart8: 5, nfsheat: 4, tekken8: 3, sf6: 3 },
};

/* ---------------------------------- أدوات ---------------------------------- */

function sanitizeKey(s) {
  return (s || '').trim().replace(/[\s\\/'"]+/g, '_').slice(0, 40);
}

async function storageSetSafe(key, value, shared, attempts = 2) {
  // shared=false يعني بيانات خاصة بهذا الجهاز بس (زي معرفة مين المستخدم الحالي)
  if (shared === false) {
    try {
      localStorage.setItem(`qayimha:${key}`, value);
      return true;
    } catch (e) {
      return false;
    }
  }
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/kv/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error('save failed');
      return true;
    } catch (e) {
      if (i === attempts - 1) return false;
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return false;
}

async function storageGetSafe(key, shared, attempts = 2) {
  if (shared === false) {
    try {
      const value = localStorage.getItem(`qayimha:${key}`);
      return value != null ? { key, value } : null;
    } catch (e) {
      return null;
    }
  }
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/kv/${encodeURIComponent(key)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('fetch failed');
      return await res.json();
    } catch (e) {
      if (i === attempts - 1) return null;
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return null;
}

function genreAverages(ratings, gamesList) {
  const list = gamesList || GAMES;
  const sums = {}; const counts = {};
  GENRE_ORDER.forEach(g => { sums[g] = 0; counts[g] = 0; });
  Object.entries(ratings || {}).forEach(([gameId, score]) => {
    const game = list.find(g => g.id === gameId);
    if (!game) return;
    sums[game.genre] += score;
    counts[game.genre] += 1;
  });
  const out = {};
  GENRE_ORDER.forEach(g => { out[g] = counts[g] ? sums[g] / counts[g] : 0; });
  return out;
}

function normalizeReview(r) {
  if (r == null) return null;
  if (typeof r === 'string') return { text: r, spoiler: false };
  return { text: r.text || '', spoiler: !!r.spoiler };
}

function computeMatch(myRatings, otherRatings) {
  const common = Object.keys(myRatings || {}).filter(id => otherRatings && otherRatings[id] != null);
  if (common.length === 0) return null;
  const diffSum = common.reduce((acc, id) => acc + Math.abs(myRatings[id] - otherRatings[id]), 0);
  const avgDiff = diffSum / common.length;
  const sim = Math.max(0, 100 - (avgDiff / 4) * 100);
  return { pct: Math.round(sim), common: common.length };
}

/* ---------------------------------- سياق أغلفة IGDB ---------------------------------- */

const CoverContext = React.createContext({ covers: {}, requestCover: () => {} });

/* ---------------------------------- مكوّنات فرعية ---------------------------------- */

function GameCover({ game, size = 'md', avg }) {
  const { covers, requestCover } = React.useContext(CoverContext);
  const coverInfo = covers[game.id];
  const coverUrl = coverInfo && coverInfo.url;

  useEffect(() => {
    requestCover(game);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const meta = GENRES[game.genre];
  const Icon = meta.icon;
  const h = size === 'lg' ? 150 : 100;
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex items-end p-2"
      style={{
        height: h,
        backgroundImage: coverUrl
          ? `linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.05) 60%), url(${coverUrl})`
          : `radial-gradient(120% 100% at 15% 0%, ${meta.c1}CC, transparent 60%), linear-gradient(155deg, ${meta.c1}, ${meta.c2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07), 0 6px 16px rgba(0,0,0,0.35)',
      }}
    >
      {!coverUrl && (
        <Icon
          size={size === 'lg' ? 64 : 46}
          color="#ffffff"
          strokeWidth={1.25}
          style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%,-50%) rotate(-8deg)', opacity: 0.16 }}
        />
      )}
      {!coverUrl && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.45), transparent 55%)' }} />
      )}
      <span
        className="relative text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(2px)' }}
      >
        {meta.label}
      </span>
      {avg && (
        <span
          className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: GOLD }}
        >
          <Star size={9} fill={GOLD} color={GOLD} /> {avg}
        </span>
      )}
      {game.age && (
        <span
          className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}
        >
          {game.age}
        </span>
      )}
    </div>
  );
}

function StarRow({ value, onRate, size = 22 }) {
  return (
    <div className="flex flex-row-reverse gap-1 justify-end" dir="ltr">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => onRate(i)}
          className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
          aria-label={`قيّم ${i} من 5`}
        >
          <Star
            size={size}
            color={GOLD}
            fill={i <= value ? GOLD : 'transparent'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function GenreRadar({ mine, other, otherLabel }) {
  const data = GENRE_ORDER.map(g => ({
    genre: GENRES[g].label,
    أنا: Number((mine[g] || 0).toFixed(2)),
    ...(other ? { [otherLabel]: Number((other[g] || 0).toFixed(2)) } : {}),
  }));
  return (
    <ResponsiveContainer width="100%" height={270}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#332F47" />
        <PolarAngleAxis dataKey="genre" tick={{ fill: MUTED, fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
        <Radar name="أنا" dataKey="أنا" stroke={TEAL} fill={TEAL} fillOpacity={0.35} />
        {other && (
          <Radar name={otherLabel} dataKey={otherLabel} stroke={GOLD} fill={GOLD} fillOpacity={0.25} />
        )}
        <Legend wrapperStyle={{ fontSize: 12, color: TEXT }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function Avatar({ src, name, size = 40, onClick, editable }) {
  const initial = (name || '?').trim().charAt(0);
  return (
    <div
      onClick={onClick}
      className="relative rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size, height: size,
        backgroundColor: SURFACE2,
        boxShadow: `0 0 0 2px ${SURFACE2}, 0 0 0 3px rgba(232,178,61,0.35)`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span className="font-display font-bold" style={{ color: GOLD, fontSize: size * 0.4 }}>{initial}</span>
      )}
      {editable && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
          style={{ height: '38%', backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <Camera size={size * 0.28} color="#fff" />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- التطبيق ---------------------------------- */

export default function GameRatingApp() {
  const [booting, setBooting] = useState(true);
  const [me, setMe] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [platformInput, setPlatformInput] = useState([]);
  const [creating, setCreating] = useState(false);

  const [tab, setTab] = useState('library');
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [customGames, setCustomGames] = useState([]);
  const [addGameOpen, setAddGameOpen] = useState(false);
  const [savingGame, setSavingGame] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', genre: 'action', year: new Date().getFullYear(), age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: '' });

  const [myRatings, setMyRatings] = useState({});
  const [myReviews, setMyReviews] = useState({});
  const [myAvatar, setMyAvatar] = useState(null);
  const [myPlatforms, setMyPlatforms] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [listPickerFor, setListPickerFor] = useState(null); // gameId currently adding to a list
  const [wrapOpen, setWrapOpen] = useState(false);
  const [platformFilterOn, setPlatformFilterOn] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);
  const [reviewDraft, setReviewDraft] = useState('');
  const [spoilerDraft, setSpoilerDraft] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());
  const [gameReviews, setGameReviews] = useState([]);
  const [loadingGameReviews, setLoadingGameReviews] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [gameStats, setGameStats] = useState({});

  const [community, setCommunity] = useState(null); // null = not loaded yet
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [myFriends, setMyFriends] = useState([]);
  const [chatWith, setChatWith] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [persistenceWarning, setPersistenceWarning] = useState(false);

  /* ------ أغلفة الألعاب من IGDB (قائمة انتظار + كاش دائم) ------ */
  const [gameCovers, setGameCovers] = useState({});
  const requestedCoversRef = useRef(new Set());
  const coverQueueRef = useRef([]);
  const processingQueueRef = useRef(false);

  const processCoverQueue = useCallback(async () => {
    if (processingQueueRef.current) return;
    processingQueueRef.current = true;
    while (coverQueueRef.current.length > 0) {
      const game = coverQueueRef.current.shift();
      try {
        const cacheRes = await storageGetSafe(`igdb-cover:${game.id}`, true);
        if (cacheRes && cacheRes.value) {
          setGameCovers(prev => ({ ...prev, [game.id]: JSON.parse(cacheRes.value) }));
        } else {
          const res = await fetch(`${BACKEND_URL}/api/games/search?q=${encodeURIComponent(game.name)}`);
          const data = await res.json();
          const match = Array.isArray(data) ? data.find(d => d.cover && d.cover.url) : null;
          const coverUrl = match ? 'https:' + match.cover.url.replace('t_thumb', 't_cover_big') : null;
          const result = { url: coverUrl };
          setGameCovers(prev => ({ ...prev, [game.id]: result }));
          await storageSetSafe(`igdb-cover:${game.id}`, JSON.stringify(result), true);
        }
      } catch (e) {
        setGameCovers(prev => ({ ...prev, [game.id]: { url: null } }));
      }
      await new Promise(r => setTimeout(r, 260));
    }
    processingQueueRef.current = false;
  }, []);

  const requestCover = useCallback((game) => {
    if (!game || requestedCoversRef.current.has(game.id)) return;
    requestedCoversRef.current.add(game.id);
    coverQueueRef.current.push(game);
    processCoverQueue();
  }, [processCoverQueue]);

  /* ------ تحميل أولي ------ */
  useEffect(() => {
    (async () => {
      try {
        const meRes = await storageGetSafe('me', false);
        if (meRes && meRes.value) {
          const parsed = JSON.parse(meRes.value);
          await loadForUser(parsed.username);
          setMe(parsed.username);
        }
      } catch (e) {
        // لا يوجد مستخدم محفوظ بعد
      }
      setBooting(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForUser = useCallback(async (username) => {
    // إحصائيات الألعاب
    const statsRes = await storageGetSafe('game-stats', true);
    try {
      setGameStats(statsRes && statsRes.value ? JSON.parse(statsRes.value) : {});
    } catch (e) { setGameStats({}); }

    // بذر بيانات تجريبية أول مرة فقط
    const idxRes = await storageGetSafe('users-index', true);
    let idx = [];
    try { idx = idxRes && idxRes.value ? JSON.parse(idxRes.value) : []; } catch (e) { idx = []; }
    if (!idx || idx.length === 0) {
      await seedDemoData();
    }

    // تقييماتي
    const mineRes = await storageGetSafe(`profile:${username}`, true);
    try {
      const parsed = mineRes && mineRes.value ? JSON.parse(mineRes.value) : {};
      setMyRatings(parsed.ratings || {});
      setMyReviews(parsed.reviews || {});
      setMyPlatforms(parsed.platforms || []);
      setIsPremium(!!parsed.premium);
      setMyFriends(parsed.friends || []);
      setCustomLists(parsed.customLists || []);
    } catch (e) { setMyRatings({}); setMyReviews({}); }

    // الصورة الشخصية
    const avRes = await storageGetSafe(`avatar:${username}`, true);
    setMyAvatar(avRes && avRes.value ? avRes.value : null);

    // ألعاب زادها المستخدمين
    const customRes = await storageGetSafe('custom-games', true);
    try {
      setCustomGames(customRes && customRes.value ? JSON.parse(customRes.value) : []);
    } catch (e) { setCustomGames([]); }
  }, []);

  const seedDemoData = async () => {
    const names = Object.keys(DEMO_USERS);
    await storageSetSafe('users-index', JSON.stringify(names), true);
    const stats = {};
    for (const name of names) {
      const ratings = DEMO_USERS[name];
      await storageSetSafe(`profile:${name}`, JSON.stringify({ ratings }), true);
      Object.entries(ratings).forEach(([gid, score]) => {
        if (!stats[gid]) stats[gid] = { sum: 0, count: 0 };
        stats[gid].sum += score;
        stats[gid].count += 1;
      });
    }
    const ok = await storageSetSafe('game-stats', JSON.stringify(stats), true);
    if (ok) setGameStats(stats);
  };

  /* ------ إنشاء بروفايل ------ */
  const handleCreateProfile = async () => {
    const raw = nameInput.trim();
    if (!/^[A-Za-z0-9_]{1,30}$/.test(raw)) {
      setErrorMsg('اليوزر لازم يكون حروف إنجليزي وأرقام و"_" بس (١-٣٠ خانة)، بدون مسافات أو رموز ثانية.');
      return;
    }
    const clean = raw;
    setCreating(true);
    setErrorMsg('');

    let idx = [];
    const idxRes = await storageGetSafe('users-index', true);
    try { idx = idxRes && idxRes.value ? JSON.parse(idxRes.value) : []; } catch (e) { idx = []; }

    const taken = idx.some(u => u.toLowerCase() === clean.toLowerCase());
    if (taken) {
      setErrorMsg('اليوزر هذا مأخوذ، جرّب وحد ثاني.');
      setCreating(false);
      return;
    }

    const persisted = await storageSetSafe('me', JSON.stringify({ username: clean }), false);
    if (!persisted) {
      setPersistenceWarning(true);
    }

    if (!idx.includes(clean)) idx.push(clean);
    await storageSetSafe('users-index', JSON.stringify(idx), true);
    await storageSetSafe(`profile:${clean}`, JSON.stringify({ ratings: {}, platforms: platformInput }), true);
    setMyPlatforms(platformInput);

    try {
      await loadForUser(clean);
    } catch (e) {
      // تجاهل — التطبيق يشتغل ببيانات فاضية
    }

    // ندخله التطبيق دايماً، حتى لو التخزين الدائم متعثر — يشتغل بذاكرة الجلسة
    setMe(clean);
    setCreating(false);
  };

  /* ------ حفظ ملفي كامل (يحافظ على كل الحقول) ------ */
  const saveProfile = async (overrides = {}) => {
    const payload = {
      ratings: myRatings,
      reviews: myReviews,
      platforms: myPlatforms,
      premium: isPremium,
      customLists,
      friends: myFriends,
      ...overrides,
    };
    const ok = await storageSetSafe(`profile:${me}`, JSON.stringify(payload), true);
    if (!ok) setPersistenceWarning(true);
    return ok;
  };

  const toggleFriend = async (username) => {
    const updated = myFriends.includes(username) ? myFriends.filter(f => f !== username) : [...myFriends, username];
    setMyFriends(updated);
    await saveProfile({ friends: updated });
  };

  /* ------ الدردشة المباشرة ------ */
  const chatKey = (a, b) => `chat:${[a, b].sort().join('__')}`;

  const openChat = async (peerName) => {
    setChatWith(peerName);
    setChatMessages([]);
    setLoadingChat(true);
    try {
      const res = await storageGetSafe(chatKey(me, peerName), true);
      const msgs = res && res.value ? JSON.parse(res.value) : [];
      setChatMessages(msgs);
    } catch (e) {
      setChatMessages([]);
    }
    setLoadingChat(false);
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !chatWith) return;
    setSendingChat(true);
    let current = [];
    try {
      const res = await storageGetSafe(chatKey(me, chatWith), true);
      current = res && res.value ? JSON.parse(res.value) : [];
    } catch (e) { current = chatMessages; }
    const updated = [...current, { from: me, text, ts: Date.now() }];
    setChatMessages(updated);
    setChatInput('');
    const ok = await storageSetSafe(chatKey(me, chatWith), JSON.stringify(updated), true);
    if (!ok) setPersistenceWarning(true);
    setSendingChat(false);
  };

  useEffect(() => {
    if (!chatWith) return;
    const interval = setInterval(async () => {
      try {
        const res = await storageGetSafe(chatKey(me, chatWith), true);
        const msgs = res && res.value ? JSON.parse(res.value) : [];
        setChatMessages(msgs);
      } catch (e) { /* تجاهل */ }
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWith]);

  /* ------ تقييم لعبة ------ */
  const rateGame = async (gameId, score) => {
    const old = myRatings[gameId];
    const updated = { ...myRatings, [gameId]: score };
    setMyRatings(updated);

    const stats = { ...gameStats };
    if (!stats[gameId]) stats[gameId] = { sum: 0, count: 0 };
    else stats[gameId] = { ...stats[gameId] };
    if (old != null) {
      stats[gameId].sum += score - old;
    } else {
      stats[gameId].sum += score;
      stats[gameId].count += 1;
    }
    setGameStats(stats);

    await saveProfile({ ratings: updated });
    const ok2 = await storageSetSafe('game-stats', JSON.stringify(stats), true);
    if (!ok2) setPersistenceWarning(true);
  };

  /* ------ حفظ نص المراجعة ------ */
  const saveReview = async (gameId, text, spoiler) => {
    setSavingReview(true);
    const updatedReviews = { ...myReviews };
    if (text && text.trim()) updatedReviews[gameId] = { text: text.trim(), spoiler: !!spoiler };
    else delete updatedReviews[gameId];
    setMyReviews(updatedReviews);
    await saveProfile({ reviews: updatedReviews });
    setSavingReview(false);
    setGameReviews(prev => {
      const withoutMe = prev.filter(r => r.username !== me);
      return text && text.trim()
        ? [{ username: me, avatar: myAvatar, score: myRatings[gameId] || 0, review: text.trim(), spoiler: !!spoiler }, ...withoutMe]
        : withoutMe;
    });
  };

  /* ------ آراء اللاعبين الثانيين على لعبة معيّنة ------ */
  const loadGameReviews = useCallback(async (gameId) => {
    setLoadingGameReviews(true);
    try {
      const idxRes = await storageGetSafe('users-index', true);
      const idx = idxRes && idxRes.value ? JSON.parse(idxRes.value) : [];
      const others = idx.filter(n => n !== me);
      const list = [];
      for (const name of others) {
        const res = await storageGetSafe(`profile:${name}`, true);
        try {
          const parsed = res && res.value ? JSON.parse(res.value) : {};
          const score = parsed.ratings ? parsed.ratings[gameId] : null;
          if (score != null) {
            const avRes = await storageGetSafe(`avatar:${name}`, true);
            const rev = normalizeReview(parsed.reviews ? parsed.reviews[gameId] : null);
            list.push({
              username: name,
              avatar: avRes && avRes.value ? avRes.value : null,
              score,
              review: rev ? rev.text : null,
              spoiler: rev ? rev.spoiler : false,
            });
          }
        } catch (e) {
          // تجاهل هذا المستخدم لو فشل تحميله
        }
      }
      list.sort((a, b) => (b.review ? 1 : 0) - (a.review ? 1 : 0));
      setGameReviews(list);
    } catch (e) {
      setGameReviews([]);
    }
    setLoadingGameReviews(false);
  }, [me]);

  useEffect(() => {
    if (selectedGame) { loadGameReviews(selectedGame.id); requestCover(selectedGame); }
    else setGameReviews([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  /* ------ إضافة لعبة جديدة ------ */
  /* ------ الاشتراك (تجريبي محلي — بدون دفع حقيقي) ------ */
  const togglePremium = async () => {
    const next = !isPremium;
    setIsPremium(next);
    await saveProfile({ premium: next });
  };

  /* ------ إدارة القوائم المخصصة (ميزة مميزة) ------ */
  const createList = async () => {
    const name = newListName.trim();
    if (!name) return;
    const list = { id: 'list_' + Date.now(), name, gameIds: [] };
    const updated = [...customLists, list];
    setCustomLists(updated);
    await saveProfile({ customLists: updated });
    setNewListName('');
  };

  const deleteList = async (listId) => {
    const updated = customLists.filter(l => l.id !== listId);
    setCustomLists(updated);
    await saveProfile({ customLists: updated });
  };

  const toggleGameInList = async (listId, gameId) => {
    const updated = customLists.map(l => {
      if (l.id !== listId) return l;
      const has = l.gameIds.includes(gameId);
      return { ...l, gameIds: has ? l.gameIds.filter(id => id !== gameId) : [...l.gameIds, gameId] };
    });
    setCustomLists(updated);
    await saveProfile({ customLists: updated });
  };

  /* ------ توقع تقييمك للعبة (ميزة مميزة، من متوسط تصنيفها عندك) ------ */
  const predictRating = (game) => {
    if (!game) return null;
    const genreRatedCount = Object.keys(myRatings).filter(id => {
      const g = allGames.find(x => x.id === id);
      return g && g.genre === game.genre;
    }).length;
    if (genreRatedCount < 3) return null;
    return Math.round(myAverages[game.genre] * 10) / 10;
  };

  const addCustomGame = async () => {
    const name = newGame.name.trim();
    if (!name) return;
    setSavingGame(true);
    const baseId = 'u_' + sanitizeKey(name).toLowerCase();
    const existingIds = new Set([...GAMES.map(g => g.id), ...customGames.map(g => g.id)]);
    let id = baseId;
    let n = 1;
    while (existingIds.has(id)) { id = `${baseId}_${n}`; n++; }

    const entry = {
      id,
      name,
      genre: newGame.genre,
      year: Number(newGame.year) || new Date().getFullYear(),
      age: newGame.age,
      platforms: newGame.platforms,
      desc: newGame.desc.trim() || 'ما فيه وصف بعد.',
      addedBy: me,
    };

    const updated = [...customGames, entry];
    setCustomGames(updated);
    const ok = await storageSetSafe('custom-games', JSON.stringify(updated), true);
    if (!ok) setPersistenceWarning(true);

    setNewGame({ name: '', genre: 'action', year: new Date().getFullYear(), age: '+12', platforms: ['PS5', 'Xbox', 'PC'], desc: '' });
    setAddGameOpen(false);
    setSavingGame(false);
  };

  /* ------ رفع صورة شخصية ------ */
  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !me) return;
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const size = 240;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setMyAvatar(dataUrl);
        const ok = await storageSetSafe(`avatar:${me}`, dataUrl, true);
        if (!ok) setPersistenceWarning(true);
        setUploadingAvatar(false);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ------ تحميل المجتمع ------ */
  const loadCommunity = useCallback(async () => {
    if (!me) return;
    setLoadingCommunity(true);
    try {
      const idxRes = await storageGetSafe('users-index', true);
      const idx = idxRes && idxRes.value ? JSON.parse(idxRes.value) : [];
      const others = idx.filter(n => n !== me);
      const list = [];
      for (const name of others) {
        const res = await storageGetSafe(`profile:${name}`, true);
        const avRes = await storageGetSafe(`avatar:${name}`, true);
        try {
          const ratings = res && res.value ? JSON.parse(res.value).ratings || {} : {};
          list.push({ username: name, ratings, avatar: avRes && avRes.value ? avRes.value : null, match: computeMatch(myRatings, ratings) });
        } catch (e) {
          // تجاهل هذا المستخدم لو فشل تحميله
        }
      }
      list.sort((a, b) => {
        const pa = a.match ? a.match.pct : -1;
        const pb = b.match ? b.match.pct : -1;
        return pb - pa;
      });
      setCommunity(list);
    } catch (e) {
      setCommunity([]);
    }
    setLoadingCommunity(false);
  }, [me, myRatings]);

  useEffect(() => {
    if (tab === 'community' && me) loadCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, me]);

  /* ------ فلترة المكتبة ------ */
  const allGames = [...GAMES, ...customGames];
  const filteredGames = allGames.filter(g => {
    const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase()) || g.desc.includes(query);
    const matchesGenre = !genreFilter || g.genre === genreFilter;
    const matchesPlatform = !platformFilterOn || myPlatforms.length === 0 || (g.platforms || []).some(p => myPlatforms.includes(p));
    return matchesQuery && matchesGenre && matchesPlatform;
  });

  const myAverages = genreAverages(myRatings, allGames);
  const ratedGames = Object.entries(myRatings)
    .map(([id, score]) => ({ game: allGames.find(g => g.id === id), score }))
    .filter(r => r.game)
    .sort((a, b) => b.score - a.score);

  /* ---------------------------------- عرض ---------------------------------- */

  const fontStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap');
      .font-display { font-family: 'Almarai', sans-serif; }
      .font-body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      @keyframes slideUp { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .sheet-anim { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      .overlay-anim { animation: fadeIn 0.18s ease-out; }
      .card-anim { animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
      .press { transition: transform 0.12s ease, opacity 0.12s ease; }
      .press:active { transform: scale(0.95); opacity: 0.9; }
      * { -webkit-tap-highlight-color: transparent; }
    `}</style>
  );

  if (booting) {
    return (
      <div className="font-body min-h-screen flex items-center justify-center" style={{ backgroundColor: BG, color: TEXT }} dir="rtl">
        {fontStyle}
        <Loader2 className="animate-spin" size={28} color={GOLD} />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="font-body min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: BG, color: TEXT }} dir="rtl" lang="ar">
        {fontStyle}
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-4" style={{ backgroundColor: SURFACE }}>
              <Sparkles size={32} color={GOLD} />
            </div>
          </div>
          <h1 className="font-display text-3xl font-extrabold mb-2">قيّمها</h1>
          <p className="mb-8" style={{ color: MUTED }}>قيّم الألعاب، وشوف ناس ذوقهم يشبه ذوقك.</p>

          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value.replace(/[^A-Za-z0-9_]/g, ''))}
            placeholder="username (English + numbers + _)"
            dir="ltr"
            maxLength={30}
            className="font-body w-full text-center rounded-xl py-3 px-4 mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid ${SURFACE2}` }}
            onKeyDown={e => { if (e.key === 'Enter') handleCreateProfile(); }}
          />

          <p className="text-xs font-semibold mb-2 text-right" style={{ color: MUTED }}>وش المنصة اللي تلعب فيها؟ (اختياري)</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PLATFORM_ORDER.map(p => {
              const meta = PLATFORMS_META[p];
              const Icon = meta.icon;
              const active = platformInput.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => setPlatformInput(active ? platformInput.filter(x => x !== p) : [...platformInput, p])}
                  className="flex flex-col items-center gap-1 rounded-xl py-2.5"
                  style={{ backgroundColor: active ? GOLD : SURFACE, color: active ? '#1A1408' : MUTED }}
                >
                  <Icon size={18} />
                  <span className="text-[10px] font-semibold">{meta.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCreateProfile}
            disabled={creating || !/^[A-Za-z0-9_]{1,30}$/.test(nameInput.trim())}
            className="font-display w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: GOLD, color: '#1A1408' }}
          >
            {creating ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            ابدأ
          </button>
          {errorMsg && <p className="text-sm mt-3" style={{ color: '#E27878' }}>{errorMsg}</p>}
          <p className="text-xs mt-6 flex items-center justify-center gap-1" style={{ color: MUTED }}>
            <Info size={13} />
            تقييماتك يشوفها باقي المستخدمين عشان نقدر نطابق ذوقكم
          </p>
        </div>
      </div>
    );
  }

  return (
    <CoverContext.Provider value={{ covers: gameCovers, requestCover }}>
    <div className="font-body min-h-screen pb-20" style={{ backgroundColor: BG, color: TEXT }} dir="rtl" lang="ar">
      {fontStyle}

      {/* ترويسة */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2" style={{ backgroundColor: BG }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-xl font-extrabold">قيّمها</h1>
          <div className="flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1" style={{ backgroundColor: SURFACE }}>
            <span className="text-xs" style={{ color: MUTED }}>{me}</span>
            <Avatar src={myAvatar} name={me} size={24} onClick={() => setTab('profile')} />
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />

        {persistenceWarning && (
          <div className="text-[11px] rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5" style={{ backgroundColor: '#3D2A1A', color: '#E8B23D' }}>
            <Info size={13} />
            التخزين مو شغال زين الحين — تقدر تكمل تستخدم التطبيق عادي، بس تقييماتك ممكن ما تنحفظ بين الجلسات.
          </div>
        )}

        {tab === 'library' && (
          <>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Search size={16} style={{ position: 'absolute', top: 12, right: 12, color: MUTED }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="دور على لعبة..."
                  className="font-body w-full rounded-xl py-2.5 pr-9 pl-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid ${SURFACE2}` }}
                />
              </div>
              <button
                onClick={() => setAddGameOpen(true)}
                className="rounded-xl px-3.5 flex items-center justify-center font-bold text-xl flex-shrink-0"
                style={{ backgroundColor: GOLD, color: '#1A1408' }}
                aria-label="أضف لعبة"
              >
                +
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {myPlatforms.length > 0 && (
                <button
                  onClick={() => setPlatformFilterOn(!platformFilterOn)}
                  className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold flex items-center gap-1 flex-shrink-0"
                  style={{ backgroundColor: platformFilterOn ? TEAL : SURFACE, color: platformFilterOn ? '#0A2320' : MUTED }}
                >
                  <Gamepad2 size={12} /> منصتي فقط
                </button>
              )}
              <button
                onClick={() => setGenreFilter(null)}
                className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold flex-shrink-0"
                style={{ backgroundColor: !genreFilter ? GOLD : SURFACE, color: !genreFilter ? '#1A1408' : MUTED }}
              >
                الكل
              </button>
              {GENRE_ORDER.map(g => (
                <button
                  key={g}
                  onClick={() => setGenreFilter(g)}
                  className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold flex-shrink-0"
                  style={{ backgroundColor: genreFilter === g ? GOLD : SURFACE, color: genreFilter === g ? '#1A1408' : MUTED }}
                >
                  {GENRES[g].label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* محتوى */}
      <div className="px-4">
        {tab === 'library' && (
          filteredGames.length === 0 ? (
            <div className="text-center py-16" style={{ color: MUTED }}>
              <Search size={28} className="mx-auto mb-2" />
              ما لقينا ألعاب تطابق بحثك — جرّب كلمة ثانية.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {filteredGames.map((game, i) => {
                const stat = gameStats[game.id];
                const avg = stat && stat.count ? (stat.sum / stat.count).toFixed(1) : null;
                const myScore = myRatings[game.id];
                return (
                  <div
                    key={game.id}
                    onClick={() => { setSelectedGame(game); const rv = normalizeReview(myReviews[game.id]); setReviewDraft(rv ? rv.text : ''); setSpoilerDraft(rv ? rv.spoiler : false); }}
                    className="press card-anim text-right cursor-pointer focus:outline-none"
                    style={{ animationDelay: `${(i % 10) * 25}ms` }}
                    role="button"
                    tabIndex={0}
                  >
                    <GameCover game={game} avg={avg} />
                    <div className="mt-1.5">
                      <p className="text-sm font-semibold leading-tight">{game.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px]" style={{ color: MUTED }}>{game.year}</span>
                        {avg ? (
                          <span className="text-[11px] flex items-center gap-0.5" style={{ color: GOLD }}>
                            <Star size={11} fill={GOLD} color={GOLD} /> {avg}
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: MUTED }}>—</span>
                        )}
                      </div>
                      {myScore && (
                        <div className="mt-0.5">
                          <StarRow value={myScore} onRate={() => {}} size={11} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === 'profile' && (
          <div className="mt-2">
            <div className="flex flex-col items-center mb-4">
              <Avatar
                src={myAvatar}
                name={me}
                size={84}
                editable
                onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
              />
              {uploadingAvatar && <p className="text-[11px] mt-1" style={{ color: MUTED }}>يرفع الصورة...</p>}
              <p className="font-display font-bold mt-2">{me}</p>
            </div>

            {ratedGames.length > 0 && (
              <div className="mb-4">
                <p className="font-display font-bold mb-2">أفضل ٥ ألعابي</p>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {ratedGames.slice(0, 5).map(({ game, score }, i) => (
                    <div key={game.id} className="flex-shrink-0" style={{ width: 96 }}>
                      <div className="relative">
                        <GameCover game={game} />
                        <span
                          className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center font-display font-extrabold text-[11px]"
                          style={{ width: 20, height: 20, backgroundColor: GOLD, color: '#1A1408' }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1 truncate">{game.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="rounded-2xl p-4 mb-4"
              style={{
                backgroundImage: isPremium
                  ? `linear-gradient(135deg, ${GOLD}22, ${SURFACE})`
                  : 'none',
                backgroundColor: SURFACE,
                border: isPremium ? `1px solid ${GOLD}55` : `1px solid ${SURFACE2}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={15} color={isPremium ? GOLD : MUTED} />
                <p className="font-display font-bold">قيّمها بلس</p>
              </div>

              {isPremium ? (
                <>
                  <p className="text-xs mb-3" style={{ color: MUTED }}>مفعّلة عندك — استمتع بالمزايا 🎉</p>
                  <button
                    onClick={togglePremium}
                    className="press w-full text-xs py-2 rounded-xl font-bold"
                    style={{ backgroundColor: SURFACE2, color: MUTED }}
                  >
                    إلغاء الاشتراك
                  </button>
                </>
              ) : (
                <>
                  <ul className="text-xs mb-3 flex flex-col gap-1" style={{ color: MUTED }}>
                    <li>• قوائم مخصصة غير محدودة</li>
                    <li>• توقع تقييمك قبل ما تلعب</li>
                    <li>• ملخص سنتك الكامل</li>
                  </ul>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={togglePremium}
                      className="press rounded-xl p-3 text-center"
                      style={{ backgroundColor: SURFACE2, border: `1px solid ${SURFACE2}` }}
                    >
                      <p className="font-display font-bold text-sm">١٥ ر.س</p>
                      <p className="text-[10px]" style={{ color: MUTED }}>شهرياً</p>
                    </button>
                    <button
                      onClick={togglePremium}
                      className="press rounded-xl p-3 text-center relative"
                      style={{ backgroundColor: `${GOLD}18`, border: `1px solid ${GOLD}66` }}
                    >
                      <span className="absolute -top-2 right-1/2 translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: GOLD, color: '#1A1408' }}>وفّر ٣٣٪</span>
                      <p className="font-display font-bold text-sm" style={{ color: GOLD }}>١٢٠ ر.س</p>
                      <p className="text-[10px]" style={{ color: MUTED }}>سنوياً</p>
                    </button>
                  </div>
                </>
              )}
            </div>

            {isPremium && (
              <div className="mb-4">
                <button
                  onClick={() => setWrapOpen(true)}
                  className="press w-full rounded-2xl p-4 text-right"
                  style={{ backgroundImage: `linear-gradient(135deg, ${GOLD}, #8a6516)` }}
                >
                  <p className="font-display font-bold" style={{ color: '#1A1408' }}>ملخص سنتك بقيّمها 🎁</p>
                  <p className="text-xs mt-0.5" style={{ color: '#3d2f0e' }}>شوف إحصائياتك الكاملة</p>
                </button>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-display font-bold">قوائمي</p>
                {!isPremium && <span className="text-[10px]" style={{ color: MUTED }}>ميزة قيّمها بلس</span>}
              </div>

              {isPremium ? (
                <>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={newListName}
                      onChange={e => setNewListName(e.target.value)}
                      placeholder="اسم قائمة جديدة..."
                      className="font-body flex-1 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid ${SURFACE2}` }}
                      onKeyDown={e => { if (e.key === 'Enter') createList(); }}
                    />
                    <button onClick={createList} className="press px-4 rounded-xl font-bold" style={{ backgroundColor: GOLD, color: '#1A1408' }}>+</button>
                  </div>
                  {customLists.length === 0 ? (
                    <p className="text-xs" style={{ color: MUTED }}>سوّي أول قائمة، مثل "أفضل ألعاب الرعب" أو "أسوأ خيبة أمل".</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {customLists.map(list => (
                        <div key={list.id} className="rounded-xl p-3" style={{ backgroundColor: SURFACE }}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold">{list.name} <span style={{ color: MUTED }}>({list.gameIds.length})</span></p>
                            <button onClick={() => deleteList(list.id)} className="press">
                              <X size={14} color={MUTED} />
                            </button>
                          </div>
                          {list.gameIds.length > 0 && (
                            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                              {list.gameIds.map(gid => {
                                const g = allGames.find(x => x.id === gid);
                                if (!g) return null;
                                return <div key={gid} style={{ width: 56 }} className="flex-shrink-0"><GameCover game={g} /></div>;
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs" style={{ color: MUTED }}>فعّل قيّمها بلس عشان تسوي قوائم مخصصة غير "أفضل ٥".</p>
              )}
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: SURFACE }}>
              <p className="font-display font-bold mb-1">بصمة ذوقك</p>
              <p className="text-xs mb-2" style={{ color: MUTED }}>متوسط تقييمك في كل تصنيف</p>
              {ratedGames.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: MUTED }}>قيّم أول لعبة عشان تبدأ تتكوّن بصمتك.</p>
              ) : (
                <GenreRadar mine={myAverages} />
              )}
            </div>

            <p className="font-display font-bold mb-2">تقييماتي ({ratedGames.length})</p>
            {ratedGames.length === 0 ? (
              <p className="text-sm" style={{ color: MUTED }}>لسا ما قيّمت أي لعبة — روح لتبويب المكتبة وابدأ.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {ratedGames.map(({ game, score }) => (
                  <div
                    key={game.id}
                    onClick={() => { setSelectedGame(game); const rv = normalizeReview(myReviews[game.id]); setReviewDraft(rv ? rv.text : ''); setSpoilerDraft(rv ? rv.spoiler : false); }}
                    className="flex items-center gap-3 rounded-xl p-2 text-right w-full cursor-pointer"
                    style={{ backgroundColor: SURFACE }}
                  >
                    <div className="w-14 flex-shrink-0"><GameCover game={game} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{game.name}</p>
                      <StarRow value={score} onRate={(s) => rateGame(game.id, s)} size={15} />
                      {myReviews[game.id] && (() => {
                        const rv = normalizeReview(myReviews[game.id]);
                        return (
                          <p className="text-xs mt-1 truncate" style={{ color: MUTED }}>
                            {rv.spoiler && <span style={{ color: '#E27878' }}>⚠️ </span>}
                            {rv.text}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'community' && (
          <div className="mt-2">
            {selectedPeer ? (
              <div>
                <button onClick={() => setSelectedPeer(null)} className="flex items-center gap-1 text-sm mb-3" style={{ color: MUTED }}>
                  <ChevronLeft size={16} /> رجوع للمجتمع
                </button>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => toggleFriend(selectedPeer.username)}
                    className="press flex-1 text-xs py-2.5 rounded-xl font-semibold"
                    style={{ backgroundColor: myFriends.includes(selectedPeer.username) ? `${GOLD}22` : SURFACE, color: myFriends.includes(selectedPeer.username) ? GOLD : MUTED }}
                  >
                    {myFriends.includes(selectedPeer.username) ? '✓ صديقك' : '+ أضفه صديق'}
                  </button>
                  <button
                    onClick={() => openChat(selectedPeer.username)}
                    className="press flex-1 text-xs py-2.5 rounded-xl font-semibold"
                    style={{ backgroundColor: TEAL, color: '#0A2320' }}
                  >
                    راسله
                  </button>
                </div>
                <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: SURFACE }}>
                  <p className="font-display font-bold mb-1">أنا مقابل {selectedPeer.username}</p>
                  {selectedPeer.match ? (
                    <p className="text-sm mb-2" style={{ color: TEAL }}>
                      تطابق {selectedPeer.match.pct}% ({selectedPeer.match.common} لعبة مشتركة)
                    </p>
                  ) : (
                    <p className="text-sm mb-2" style={{ color: MUTED }}>ما فيه ألعاب مقيّمة مشتركة بعد</p>
                  )}
                  <GenreRadar mine={myAverages} other={genreAverages(selectedPeer.ratings, allGames)} otherLabel={selectedPeer.username} />
                </div>
                <p className="font-display font-bold mb-2">أعلى تقييماته</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(selectedPeer.ratings)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([gid, score]) => {
                      const game = allGames.find(g => g.id === gid);
                      if (!game) return null;
                      return (
                        <div key={gid} className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: SURFACE }}>
                          <div className="w-14 flex-shrink-0"><GameCover game={game} /></div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{game.name}</p>
                            <StarRow value={score} onRate={() => {}} size={14} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : loadingCommunity ? (
              <div className="text-center py-16" style={{ color: MUTED }}>
                <Loader2 className="animate-spin mx-auto mb-2" size={22} />
                نجهّز المجتمع...
              </div>
            ) : !community || community.length === 0 ? (
              <div className="text-center py-16" style={{ color: MUTED }}>
                <Users size={28} className="mx-auto mb-2" />
                ما فيه مستخدمين ثانيين لسا — رجّع بعدين.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...community].sort((a, b) => (myFriends.includes(b.username) ? 1 : 0) - (myFriends.includes(a.username) ? 1 : 0)).map(peer => (
                  <div
                    key={peer.username}
                    className="w-full flex items-center justify-between rounded-xl p-3"
                    style={{ backgroundColor: SURFACE }}
                  >
                    <button onClick={() => setSelectedPeer(peer)} className="flex items-center gap-2 flex-1 text-right min-w-0">
                      <Avatar src={peer.avatar} name={peer.username} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold flex items-center gap-1">
                          {myFriends.includes(peer.username) && <span style={{ color: GOLD }}>★</span>}
                          {peer.username}
                        </p>
                        <p className="text-[11px]" style={{ color: MUTED }}>{Object.keys(peer.ratings).length} لعبة مقيّمة</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {peer.match ? (
                        <span className="text-sm font-bold" style={{ color: TEAL }}>{peer.match.pct}%</span>
                      ) : (
                        <span className="text-[10px]" style={{ color: MUTED }}>ما فيه تطابق</span>
                      )}
                      <button onClick={() => openChat(peer.username)} className="press rounded-full p-2" style={{ backgroundColor: SURFACE2 }}>
                        <MessageCircle size={14} color={TEAL} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* شريط سفلي */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around py-2.5" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${SURFACE2}` }}>
        {[
          { key: 'library', label: 'المكتبة', icon: Library },
          { key: 'profile', label: 'ملفي', icon: User },
          { key: 'community', label: 'المجتمع', icon: Users },
        ].map(item => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button key={item.key} onClick={() => { setTab(item.key); setSelectedPeer(null); }} className="press flex flex-col items-center gap-1 px-4">
              <Icon size={20} color={active ? GOLD : MUTED} />
              <span className="text-[11px]" style={{ color: active ? GOLD : MUTED, fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* نافذة اللعبة */}
      {selectedGame && (
        <div className="overlay-anim fixed inset-0 z-20" style={{ backgroundColor: SURFACE }}>
          <div
            className="sheet-anim h-full overflow-y-auto"
            style={{ backgroundColor: SURFACE }}
          >
            <div className="relative" style={{ height: 190 }}>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: gameCovers[selectedGame.id] && gameCovers[selectedGame.id].url
                    ? `linear-gradient(0deg, ${SURFACE} 0%, rgba(0,0,0,0.15) 60%), url(${gameCovers[selectedGame.id].url})`
                    : `radial-gradient(120% 100% at 15% 0%, ${GENRES[selectedGame.genre].c1}CC, transparent 60%), linear-gradient(155deg, ${GENRES[selectedGame.genre].c1}, ${GENRES[selectedGame.genre].c2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              />
              <div className="relative flex justify-between items-start p-4">
                <button onClick={() => setSelectedGame(null)} className="rounded-full p-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <X size={16} color="#fff" />
                </button>
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}>{selectedGame.year}</span>
              </div>
              <div className="relative absolute bottom-0 left-0 right-0 p-4">
                <h2 className="font-display text-lg font-bold" style={{ color: '#fff' }}>{selectedGame.name}</h2>
              </div>
            </div>
            <div className="px-5 pt-3 pb-8">
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: SURFACE2, color: MUTED }}>
                تصنيف عمري {selectedGame.age}
              </span>
            </div>
            {selectedGame.platforms && (
              <div className="flex items-center gap-2 mt-2">
                {selectedGame.platforms.map(p => {
                  const meta = PLATFORMS_META[p];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <span key={p} className="text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1" style={{ backgroundColor: SURFACE2, color: MUTED }}>
                      <Icon size={11} /> {meta.label}
                    </span>
                  );
                })}
              </div>
            )}
            <p className="text-sm mt-2 mb-4" style={{ color: MUTED }}>{selectedGame.desc}</p>

            {selectedGame.summary && (
              <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: SURFACE2 }}>
                <p className="text-xs leading-relaxed" style={{ color: MUTED, whiteSpace: 'pre-line' }}>{selectedGame.summary}</p>
              </div>
            )}

            {gameStats[selectedGame.id] && gameStats[selectedGame.id].count > 0 && (
              <p className="text-sm mb-3 flex items-center gap-1" style={{ color: GOLD }}>
                <Star size={14} fill={GOLD} color={GOLD} />
                {(gameStats[selectedGame.id].sum / gameStats[selectedGame.id].count).toFixed(1)} متوسط ({gameStats[selectedGame.id].count} تقييم)
              </p>
            )}

            {isPremium && !myRatings[selectedGame.id] && predictRating(selectedGame) != null && (
              <div className="rounded-xl p-3 mb-3 flex items-center gap-2" style={{ backgroundColor: `${GOLD}18`, border: `1px solid ${GOLD}44` }}>
                <Sparkles size={16} color={GOLD} />
                <p className="text-xs" style={{ color: GOLD }}>
                  على حسب ذوقك، نتوقع بتعطيها تقريباً <span className="font-bold">{predictRating(selectedGame)}/٥</span>
                </p>
              </div>
            )}

            <p className="text-sm font-semibold mb-2">تقييمك</p>
            <StarRow value={myRatings[selectedGame.id] || 0} onRate={(s) => rateGame(selectedGame.id, s)} size={30} />

            {isPremium && (
              <div className="mt-3">
                <button
                  onClick={() => setListPickerFor(listPickerFor === selectedGame.id ? null : selectedGame.id)}
                  className="press text-xs px-3 py-2 rounded-full font-semibold"
                  style={{ backgroundColor: SURFACE2, color: MUTED }}
                >
                  + أضف لقائمة
                </button>
                {listPickerFor === selectedGame.id && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {customLists.length === 0 ? (
                      <p className="text-xs" style={{ color: MUTED }}>ما عندك قوائم بعد — سوّي وحدة من تبويب "ملفي".</p>
                    ) : (
                      customLists.map(list => {
                        const inList = list.gameIds.includes(selectedGame.id);
                        return (
                          <button
                            key={list.id}
                            onClick={() => toggleGameInList(list.id, selectedGame.id)}
                            className="press flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                            style={{ backgroundColor: inList ? `${TEAL}22` : SURFACE2, color: inList ? TEAL : MUTED }}
                          >
                            <span>{list.name}</span>
                            {inList && <span>✓</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            <p className="text-sm font-semibold mt-5 mb-2">رأيك بالتفصيل (اختياري)</p>
            <textarea
              value={reviewDraft}
              onChange={e => setReviewDraft(e.target.value)}
              placeholder="وش عجبك أو ما عجبك باللعبة؟"
              rows={4}
              className="font-body w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ backgroundColor: SURFACE2, color: TEXT, border: `1px solid ${SURFACE2}` }}
            />

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setSpoilerDraft(false)}
                className="press flex-1 text-xs py-2 rounded-lg font-semibold"
                style={{ backgroundColor: !spoilerDraft ? TEAL : SURFACE2, color: !spoilerDraft ? '#0A2320' : MUTED }}
              >
                بدون حرق
              </button>
              <button
                type="button"
                onClick={() => setSpoilerDraft(true)}
                className="press flex-1 text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
                style={{ backgroundColor: spoilerDraft ? '#E27878' : SURFACE2, color: spoilerDraft ? '#3a0f0f' : MUTED }}
              >
                ⚠️ فيها حرق
              </button>
            </div>

            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                await saveReview(selectedGame.id, reviewDraft, spoilerDraft);
                setSelectedGame(null);
              }}
              disabled={savingReview}
              className="font-display w-full rounded-xl py-2.5 mt-2 font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: GOLD, color: '#1A1408' }}
            >
              {savingReview ? <Loader2 className="animate-spin" size={16} /> : null}
              حفظ المراجعة
            </button>

            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${SURFACE2}` }}>
              <p className="text-sm font-semibold mb-3">وش يقول لاعبين ثانيين</p>
              {loadingGameReviews ? (
                <div className="flex items-center gap-2 py-4" style={{ color: MUTED }}>
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-xs">نجيب الآراء...</span>
                </div>
              ) : gameReviews.length === 0 ? (
                <p className="text-xs py-3" style={{ color: MUTED }}>لسا ما فيه أحد قيّم هذي اللعبة غيرك — كن أول وحد!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {gameReviews.map(r => (
                    <div key={r.username} className="flex gap-2.5">
                      <Avatar src={r.avatar} name={r.username} size={30} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">{r.username}</p>
                          <StarRow value={r.score} onRate={() => {}} size={11} />
                        </div>
                        {r.review && (
                          r.spoiler && !revealedSpoilers.has(r.username) ? (
                            <button
                              type="button"
                              onClick={() => setRevealedSpoilers(prev => new Set(prev).add(r.username))}
                              className="press text-[11px] mt-1 px-2 py-1 rounded-lg flex items-center gap-1"
                              style={{ backgroundColor: '#E2787822', color: '#E27878' }}
                            >
                              ⚠️ فيها حرق — اضغط للعرض
                            </button>
                          ) : (
                            <p className="text-xs mt-1" style={{ color: MUTED }}>
                              {r.spoiler && <span style={{ color: '#E27878' }}>⚠️ </span>}
                              {r.review}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة لعبة */}
      {addGameOpen && (
        <div className="overlay-anim fixed inset-0 z-20 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setAddGameOpen(false)}>
          <div
            className="sheet-anim w-full max-w-md rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: SURFACE }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="font-display text-lg font-bold">أضف لعبة</p>
              <button onClick={() => setAddGameOpen(false)} className="rounded-full p-1.5" style={{ backgroundColor: SURFACE2 }}>
                <X size={16} color={MUTED} />
              </button>
            </div>

            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>اسم اللعبة</label>
            <input
              value={newGame.name}
              onChange={e => setNewGame({ ...newGame, name: e.target.value })}
              placeholder="مثال: Elden Ring"
              className="font-body w-full rounded-xl py-2.5 px-3 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ backgroundColor: SURFACE2, color: TEXT, border: `1px solid ${SURFACE2}` }}
            />

            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>التصنيف</label>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
              {GENRE_ORDER.map(g => (
                <button
                  key={g}
                  onClick={() => setNewGame({ ...newGame, genre: g })}
                  className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold flex-shrink-0"
                  style={{ backgroundColor: newGame.genre === g ? GOLD : SURFACE2, color: newGame.genre === g ? '#1A1408' : MUTED }}
                >
                  {GENRES[g].label}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>سنة الإصدار</label>
              <input
                type="number"
                value={newGame.year}
                onChange={e => setNewGame({ ...newGame, year: e.target.value })}
                className="font-body w-full rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ backgroundColor: SURFACE2, color: TEXT, border: `1px solid ${SURFACE2}` }}
              />
            </div>

            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>التصنيف العمري</label>
            <div className="flex gap-2 mb-3">
              {['+3', '+7', '+12', '+16', '+18'].map(a => (
                <button
                  key={a}
                  onClick={() => setNewGame({ ...newGame, age: a })}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: newGame.age === a ? GOLD : SURFACE2, color: newGame.age === a ? '#1A1408' : MUTED }}
                >
                  {a}
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>متوفرة على</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PLATFORM_ORDER.map(p => {
                const meta = PLATFORMS_META[p];
                const Icon = meta.icon;
                const active = newGame.platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => setNewGame({
                      ...newGame,
                      platforms: active ? newGame.platforms.filter(x => x !== p) : [...newGame.platforms, p],
                    })}
                    className="flex flex-col items-center gap-1 rounded-xl py-2"
                    style={{ backgroundColor: active ? GOLD : SURFACE2, color: active ? '#1A1408' : MUTED }}
                  >
                    <Icon size={16} />
                    <span className="text-[10px] font-semibold">{meta.label}</span>
                  </button>
                );
              })}
            </div>

            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>وصف قصير (اختياري)</label>
            <textarea
              value={newGame.desc}
              onChange={e => setNewGame({ ...newGame, desc: e.target.value })}
              placeholder="عن وش اللعبة؟"
              rows={3}
              className="font-body w-full rounded-xl p-3 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ backgroundColor: SURFACE2, color: TEXT, border: `1px solid ${SURFACE2}` }}
            />

            <button
              onClick={addCustomGame}
              disabled={savingGame || !newGame.name.trim()}
              className="font-display w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: GOLD, color: '#1A1408' }}
            >
              {savingGame ? <Loader2 className="animate-spin" size={18} /> : null}
              أضف اللعبة
            </button>
            <p className="text-[11px] mt-2 text-center" style={{ color: MUTED }}>اللعبة بتظهر لكل مستخدمين التطبيق</p>
          </div>
        </div>
      )}

      {/* ملخص السنة (قيّمها بلس) */}
      {wrapOpen && (() => {
        const topGenre = GENRE_ORDER.reduce((best, g) => {
          const count = Object.keys(myRatings).filter(id => {
            const game = allGames.find(x => x.id === id);
            return game && game.genre === g;
          }).length;
          return count > (best.count || 0) ? { genre: g, count } : best;
        }, {});
        const topRated = ratedGames[0];
        const reviewCount = Object.keys(myReviews).length;
        const avgScore = ratedGames.length
          ? (ratedGames.reduce((s, r) => s + r.score, 0) / ratedGames.length).toFixed(1)
          : 0;
        return (
          <div className="overlay-anim fixed inset-0 z-30 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setWrapOpen(false)}>
            <div
              className="card-anim w-full max-w-sm rounded-3xl p-6 text-center relative"
              style={{ backgroundImage: `linear-gradient(160deg, #1D1029, #12101C)`, border: `1px solid ${GOLD}44` }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setWrapOpen(false)} className="absolute top-4 left-4 press">
                <X size={18} color={MUTED} />
              </button>
              <Sparkles size={28} color={GOLD} className="mx-auto mb-2" />
              <p className="font-display text-xl font-extrabold mb-1">ملخصك بقيّمها</p>
              <p className="text-xs mb-6" style={{ color: MUTED }}>{me}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl p-3" style={{ backgroundColor: SURFACE }}>
                  <p className="font-display text-2xl font-extrabold" style={{ color: GOLD }}>{ratedGames.length}</p>
                  <p className="text-[11px]" style={{ color: MUTED }}>لعبة قيّمتها</p>
                </div>
                <div className="rounded-2xl p-3" style={{ backgroundColor: SURFACE }}>
                  <p className="font-display text-2xl font-extrabold" style={{ color: TEAL }}>{avgScore}</p>
                  <p className="text-[11px]" style={{ color: MUTED }}>متوسط تقييمك</p>
                </div>
              </div>

              {topGenre.genre && (
                <div className="rounded-2xl p-4 mb-3 text-right" style={{ backgroundColor: SURFACE }}>
                  <p className="text-[11px]" style={{ color: MUTED }}>تصنيفك المفضل</p>
                  <p className="font-display font-bold flex items-center gap-1.5 mt-1">
                    {React.createElement(GENRES[topGenre.genre].icon, { size: 16, color: GOLD })}
                    {GENRES[topGenre.genre].label}
                  </p>
                </div>
              )}

              {topRated && (
                <div className="flex items-center gap-3 rounded-2xl p-3 mb-3 text-right" style={{ backgroundColor: SURFACE }}>
                  <div className="w-14 flex-shrink-0"><GameCover game={topRated.game} /></div>
                  <div>
                    <p className="text-[11px]" style={{ color: MUTED }}>أعلى تقييم</p>
                    <p className="text-sm font-semibold">{topRated.game.name}</p>
                  </div>
                </div>
              )}

              <p className="text-[11px]" style={{ color: MUTED }}>كتبت {reviewCount} مراجعة، وضفت {customLists.length} قائمة مخصصة</p>
            </div>
          </div>
        );
      })()}

      {/* الدردشة المباشرة */}
      {chatWith && (
        <div className="overlay-anim fixed inset-0 z-30 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setChatWith(null)}>
          <div
            className="sheet-anim w-full max-w-md rounded-t-3xl flex flex-col"
            style={{ backgroundColor: SURFACE, height: '75vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${SURFACE2}` }}>
              <div className="flex items-center gap-2">
                <Avatar src={null} name={chatWith} size={32} />
                <p className="font-display font-bold">{chatWith}</p>
              </div>
              <button onClick={() => setChatWith(null)} className="press rounded-full p-1.5" style={{ backgroundColor: SURFACE2 }}>
                <X size={16} color={MUTED} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin" size={22} color={MUTED} />
                </div>
              ) : chatMessages.length === 0 ? (
                <p className="text-xs text-center mt-8" style={{ color: MUTED }}>ابدأ الحديث مع {chatWith} 👋</p>
              ) : (
                chatMessages.map((m, i) => {
                  const mine = m.from === me;
                  return (
                    <div key={i} className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'self-start' : 'self-end'}`}
                      style={{ backgroundColor: mine ? GOLD : SURFACE2, color: mine ? '#1A1408' : TEXT }}
                    >
                      {m.text}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 flex gap-2" style={{ borderTop: `1px solid ${SURFACE2}` }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
                placeholder="اكتب رسالتك..."
                className="font-body flex-1 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ backgroundColor: SURFACE2, color: TEXT, border: `1px solid ${SURFACE2}` }}
              />
              <button
                onClick={sendChat}
                disabled={sendingChat || !chatInput.trim()}
                className="press rounded-xl px-4 flex items-center justify-center disabled:opacity-50"
                style={{ backgroundColor: GOLD, color: '#1A1408' }}
              >
                {sendingChat ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </CoverContext.Provider>
  );
}
