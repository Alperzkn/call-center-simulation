// Turkish UI strings, keyed by the English text used in the code.
// Wallboard labels (Service level, In queue, Longest wait, Abandoned, Available) must stay free of
// ş, ğ and ı: the 3D wallboard font only has Latin-1 glyphs.
export const TR: Record<string, string> = {
  // Top bar
  'Halden contact centre': 'Halden çağrı merkezi',
  'Agent training floor': 'Temsilci eğitim katı',
  'Live floor figures': 'Canlı kat göstergeleri',
  'Floor time': 'Kat saati',
  'Calls waiting': 'Bekleyen çağrı',
  'Longest wait': 'En uzun bekleme',
  'Service level': 'Hizmet seviyesi',
  'Simulation speed': 'Simülasyon hızı',
  Resume: 'Devam et',
  Pause: 'Duraklat',
  'The floor runs slowly while you are on a call': 'Siz görüşmedeyken kat yavaş ilerler',
  'Run the floor at {0}× speed': 'Katı {0}× hızda çalıştır',
  Dashboards: 'Paneller',
  'Floor dashboard': 'Kat paneli',
  'Team leaders': 'Takım liderleri',
  'My performance': 'Performansım',
  Language: 'Dil',

  // Agent states
  Available: 'Müsait',
  Ringing: 'Çalıyor',
  'On a call': 'Görüşmede',
  'After-call work': 'Çağrı sonrası işlem',
  'On break': 'Molada',
  'Not ready': 'Hazır değil',

  // Legend and 3D labels
  'Desk light colours': 'Masa ışığı renkleri',
  'Desk lights': 'Masa ışıkları',
  'Click an agent, a team leader or the wallboard to open its dashboard. Drag to look around.':
    'Panelini açmak için bir temsilciye, takım liderine veya duvar panosuna tıklayın. Etrafa bakmak için sürükleyin.',
  You: 'Siz',
  'Team leader, {0}': 'Takım lideri, {0}',
  'Team {0}': '{0} Takımı',
  'In queue': 'Kuyrukta',

  // Intro
  'Your first shift on the floor': 'Kattaki ilk vardiyanız',
  'You are the newest agent on Team Birch at Halden, a mobile and broadband provider. Fourteen colleagues are already taking calls around you. Your desk is the one with the blue ring.':
    'Mobil ve internet sağlayıcısı Halden’da Birch Takımı’nın en yeni temsilcisisiniz. Çevrenizde on dört çalışma arkadaşınız çağrı alıyor. Mavi halkalı masa sizin.',
  'Go ready and answer.': 'Hazır olun ve yanıtlayın.',
  'Calls are routed to you from the live queue. Each one is a real kind of contact: bill shock, an outage, a fraud attempt, a bereavement.':
    'Çağrılar size canlı kuyruktan yönlendirilir. Her biri gerçek bir başvuru türüdür: fatura şoku, kesinti, dolandırıcılık girişimi, vefat.',
  'Choose what to say.': 'Ne söyleyeceğinizi seçin.',
  'The customer reacts to every answer. The account notes and policy are on screen, as they would be at a real desk.':
    'Müşteri her yanıta tepki verir. Hesap notları ve politika, gerçek bir masada olduğu gibi ekranınızdadır.',
  'Read your scorecard.': 'Puan kartınızı okuyun.',
  'After each call your team leader marks quality, satisfaction, handle time and first-contact resolution, and explains what the best answer was.':
    'Her çağrıdan sonra takım lideriniz kaliteyi, memnuniyeti, işlem süresini ve ilk temasta çözümü puanlar ve en iyi yanıtın ne olduğunu açıklar.',
  'Watch the numbers.': 'Rakamları izleyin.',
  'Click any agent, a team leader, or the wallboard to see their dashboard. The buttons at the top open the same views.':
    'Panelini görmek için herhangi bir temsilciye, takım liderine veya duvar panosuna tıklayın. Üstteki düğmeler de aynı görünümleri açar.',
  'Start the shift': 'Vardiyayı başlat',

  // Phone
  'Your phone': 'Telefonunuz',
  'Ready. Waiting for the next call…': 'Hazır. Sıradaki çağrı bekleniyor…',
  'Go not ready': 'Hazır değil ol',
  'Not ready. Calls will not be routed to you.': 'Hazır değilsiniz. Size çağrı yönlendirilmeyecek.',
  'Go ready': 'Hazır ol',
  'Take a 10-minute break': '10 dakika mola ver',
  'On break until {0}.': 'Moladasınız. Mola bitişi: {0}.',
  'End break and go ready': 'Molayı bitir ve hazır ol',
  'Calls taken': 'Alınan çağrı',
  Quality: 'Kalite',
  'Handle time': 'İşlem süresi',
  'Incoming call': 'Gelen çağrı',
  '{0} queue': '{0} kuyruğu',
  'Caller has waited {0}': 'Arayan {0} bekledi',
  'Answer call': 'Çağrıyı yanıtla',
  'or press Enter': 'veya Enter’a basın',

  // In call
  'Thank you for calling Halden. You’re through to the support team. How can I help?':
    'Halden’ı aradığınız için teşekkürler. Destek ekibine bağlandınız. Size nasıl yardımcı olabilirim?',
  '{0} queue, account {1}': '{0} kuyruğu, hesap {1}',
  'target {0}': 'hedef {0}',
  'Customer mood': 'Müşterinin ruh hâli',
  Angry: 'Öfkeli',
  Upset: 'Gergin',
  Neutral: 'Nötr',
  Reassured: 'Rahatlamış',
  Happy: 'Memnun',
  'Account notes': 'Hesap notları',
  Policy: 'Politika',
  '{0}. Customer for {1}': '{0}. {1}dır müşteri',
  'What do you say?': 'Ne söylersiniz?',
  'The call has ended. Pick the wrap-up code that describes it. Reporting and follow-up depend on it.':
    'Çağrı sona erdi. Çağrıyı tanımlayan sonuç kodunu seçin. Raporlama ve takip buna bağlıdır.',

  // Scorecard
  'quality score': 'kalite puanı',
  'Failed: critical breach': 'Başarısız: kritik ihlal',
  'Meets the {0} target': '{0} hedefini karşılıyor',
  'Below the {0} target': '{0} hedefinin altında',
  Satisfaction: 'Memnuniyet',
  'Resolved first time': 'İlk temasta çözüm',
  'Wrap-up code': 'Sonuç kodu',
  Correct: 'Doğru',
  Wrong: 'Yanlış',
  Yes: 'Evet',
  No: 'Hayır',
  'Satisfaction is not scored on a suspected fraud call.': 'Dolandırıcılık şüphesi olan çağrılarda memnuniyet puanlanmaz.',
  'The right code was “{0}”.': 'Doğru kod şuydu: “{0}”.',
  '{0}, your team leader': '{0}, takım lideriniz',
  '{0}, team leader': '{0}, takım lideri',
  'Score by skill': 'Beceriye göre puan',
  'Your answers': 'Yanıtlarınız',
  'Critical breach': 'Kritik ihlal',
  'Missed the mark': 'Hedefi kaçırdı',
  Acceptable: 'Kabul edilebilir',
  'Best practice': 'En iyi uygulama',
  'A stronger answer': 'Daha güçlü bir yanıt',
  'Take away:': 'Çıkarılacak ders:',
  'Ready for the next call': 'Sıradaki çağrıya hazırım',
  'Take a break': 'Mola ver',
  'There was a critical breach on this call, so it fails regardless of the rest. Read the note on that step carefully, then let’s talk it through before your next one.':
    'Bu çağrıda kritik bir ihlal vardı; gerisi ne olursa olsun çağrı başarısız sayılır. O adımdaki notu dikkatle okuyun, sonra bir sonraki çağrınızdan önce üzerinden birlikte geçelim.',
  'That is the standard I would play to new starters. Nothing to change.':
    'Yeni başlayanlara örnek diye dinleteceğim düzey bu. Değiştirilecek bir şey yok.',
  'A strong call. Look at the one or two answers below that were only acceptable; that is where the last few points are.':
    'Güçlü bir çağrı. Aşağıda yalnızca kabul edilebilir kalan bir iki yanıta bakın; son birkaç puan orada.',
  'A fair call with clear gaps. Pick the weakest category below and focus on only that on your next call.':
    'Belirgin eksikleri olan orta düzey bir çağrı. Aşağıdaki en zayıf kategoriyi seçin ve bir sonraki çağrınızda yalnızca ona odaklanın.',
  'This one got away from you. Read each note below. Most of the lost marks come from not acknowledging the customer or not using the policy on screen.':
    'Bu çağrı elinizden kaçtı. Aşağıdaki her notu okuyun. Kaybedilen puanların çoğu müşteriye anlayış göstermemekten ya da ekrandaki politikayı kullanmamaktan geliyor.',

  // QA categories
  'Opening and verification': 'Açılış ve doğrulama',
  'Empathy and tone': 'Empati ve üslup',
  'Listening and discovery': 'Dinleme ve ihtiyacı anlama',
  Resolution: 'Çözüm',
  'Policy and compliance': 'Politika ve uyum',
  'Closing and next steps': 'Kapanış ve sonraki adımlar',

  // Dashboards
  Dashboard: 'Panel',
  'Close dashboard': 'Paneli kapat',
  'Off target': 'Hedef dışı',
  'On target': 'Hedefte',
  Target: 'Hedef',
  'Calls handled': 'Karşılanan çağrı',
  'Average handle time': 'Ortalama işlem süresi',
  '{0} or less': '{0} veya altı',
  'Quality score': 'Kalite puanı',
  'Schedule adherence': 'Vardiya uyumu',
  Occupancy: 'Doluluk',
  Agent: 'Temsilci',
  Agents: 'Temsilciler',
  Calls: 'Çağrı',
  Handle: 'Süre',
  'First time': 'İlk çözüm',
  'Sat.': 'Memn.',
  'Adher.': 'Uyum',
  'All queues, today so far. {0} agents in 3 teams.': 'Tüm kuyruklar, bugün şu ana kadar. 3 takımda {0} temsilci.',
  '{0} in 20 s': '20 sn içinde {0}',
  'Average speed of answer': 'Ortalama yanıtlama süresi',
  '{0} s': '{0} sn',
  Abandoned: 'Terk edilen',
  'Calls offered': 'Gelen çağrı',
  'Agents right now': 'Temsilciler şu an',
  'Calls per half hour': 'Yarım saatlik çağrı sayısı',
  Answered: 'Yanıtlanan',
  'Service level per half hour': 'Yarım saatlik hizmet seviyesi',
  Teams: 'Takımlar',
  Team: 'Takım',
  'Latest on the floor': 'Kattan son gelişmeler',
  'Nothing to report yet.': 'Henüz bildirilecek bir şey yok.',
  'Team leader: {0}. {1} agents.': 'Takım lideri: {0}. {1} temsilci.',
  'Team leader: {0}': 'Takım lideri: {0}',
  'Coaching priorities': 'Koçluk öncelikleri',
  'Everyone on the team is meeting their targets.': 'Takımdaki herkes hedeflerini tutturuyor.',
  'Take a call to see your scores by skill.': 'Beceriye göre puanlarınızı görmek için bir çağrı alın.',
  'Your performance': 'Performansınız',
  'for {0}': '({0})',
  'Call ringing': 'Çağrı çalıyor',
  'Live call': 'Canlı çağrı',
  Queue: 'Kuyruk',
  Customer: 'Müşteri',
  Reason: 'Konu',
  'Talk time': 'Görüşme süresi',
  'Your scores by skill': 'Beceriye göre puanlarınız',
  'Calls handled per half hour': 'Yarım saatte karşılanan çağrı',
  'The first half hour is still in progress.': 'İlk yarım saat henüz tamamlanmadı.',
  'Recent calls': 'Son çağrılar',
  'No calls yet.': 'Henüz çağrı yok.',
  Time: 'Saat',
  Call: 'Çağrı',
  'Satisfaction comes from customers who answer the survey; quality from the calls a team leader has monitored.':
    'Memnuniyet, anketi yanıtlayan müşterilerden; kalite ise takım liderinin dinlediği çağrılardan gelir.',

  // Floor events
  '{0} caller hung up after waiting {1}': '{0} kuyruğunda bir müşteri {1} bekledikten sonra kapattı',
  'Your break has ended. Go ready when you are back at your desk': 'Molanız bitti. Masanıza dönünce hazır durumuna geçin',
  'Service level fell to {0} in the last half hour': 'Hizmet seviyesi son yarım saatte {0} düzeyine düştü',
  'You finished “{0}” with a quality score of {1}': '“{0}” çağrısını {1} kalite puanıyla tamamladınız',

  // Coaching notes
  '{0} is just getting started. Not enough calls yet to coach on.': '{0} işe yeni başladı. Koçluk için henüz yeterli çağrı yok.',
  'You are just getting started. Not enough calls yet to coach on.': 'İşe yeni başladınız. Koçluk için henüz yeterli çağrınız yok.',
  '{0}’s quality score is {1} against a target of {2}. Review two recorded calls together and pick one behaviour to practise.':
    '{0}: kalite puanı {1}, hedef {2}. Kayıtlı iki çağrıyı birlikte dinleyin ve üzerinde çalışılacak tek bir davranış seçin.',
  'Your quality score is {1} against a target of {2}. Review two recorded calls together and pick one behaviour to practise.':
    'Kalite puanınız {1}, hedef {2}. Kayıtlı iki çağrınızı birlikte dinleyelim ve üzerinde çalışacağınız tek bir davranış seçelim.',
  '{0}’s average handle time is {1}, above the {2} target. Check where the time goes: long holds, system navigation, or wrap-up notes.':
    '{0}: ortalama işlem süresi {1}, hedef olan {2} değerinin üzerinde. Sürenin nereye gittiğine bakın: uzun bekletmeler, sistemde gezinme ya da çağrı sonrası notlar.',
  'Your average handle time is {1}, above the {2} target. Check where the time goes: long holds, system navigation, or wrap-up notes.':
    'Ortalama işlem süreniz {1}, hedef olan {2} değerinin üzerinde. Sürenin nereye gittiğine bakın: uzun bekletmeler, sistemde gezinme ya da çağrı sonrası notlar.',
  '{0}’s first-contact resolution is {1}. Customers are calling back. Look at which call types are being transferred or left open.':
    '{0}: ilk temasta çözüm oranı {1}. Müşteriler tekrar arıyor. Hangi çağrı türlerinin aktarıldığına ya da açık bırakıldığına bakın.',
  'Your first-contact resolution is {1}. Customers are calling back. Look at which call types are being left open.':
    'İlk temasta çözüm oranınız {1}. Müşteriler tekrar arıyor. Hangi çağrı türlerinin açık kaldığına bakın.',
  '{0}’s customer satisfaction is {1} out of 5. Listen for acknowledgement in the first 20 seconds of each call.':
    '{0}: müşteri memnuniyeti 5 üzerinden {1}. Her çağrının ilk 20 saniyesinde müşteriye anlayış gösterilip gösterilmediğini dinleyin.',
  'Your customer satisfaction is {1} out of 5. Listen for acknowledgement in the first 20 seconds of each call.':
    'Müşteri memnuniyetiniz 5 üzerinden {1}. Her çağrının ilk 20 saniyesinde müşteriye anlayış gösterip göstermediğinize dikkat edin.',
  '{0}’s schedule adherence is {1}. Breaks are running over or there is unscheduled not-ready time.':
    '{0}: vardiya uyumu {1}. Molalar uzuyor ya da plansız “hazır değil” süresi var.',
  'Your schedule adherence is {1}. Breaks are running over or there is unscheduled not-ready time.':
    'Vardiya uyumunuz {1}. Molalarınız uzuyor ya da plansız “hazır değil” süreniz var.',
  '{0} is meeting every target today. Recognise it, and consider them for buddying a newer colleague.':
    '{0} bugün tüm hedefleri tutturuyor. Bunu takdir edin ve yeni bir çalışma arkadaşına rehberlik etmesini değerlendirin.',
  'You are meeting every target today. Keep it up.': 'Bugün tüm hedefleri tutturuyorsunuz. Böyle devam edin.',

  // Queues
  Billing: 'Fatura',
  Technical: 'Teknik',
  Accounts: 'Hesap',
  Retention: 'Elde tutma',
  Collections: 'Tahsilat',
  Complaints: 'Şikâyet',

  // Call reasons for simulated agents
  'Bill higher than expected': 'Fatura beklenenden yüksek',
  'Refund query': 'İade sorgusu',
  'Direct Debit date change': 'Otomatik ödeme tarihi değişikliği',
  'Charge not recognised': 'Tanınmayan ücret',
  'Slow broadband speed': 'Düşük internet hızı',
  'No mobile signal at home': 'Evde mobil sinyal yok',
  'Router keeps dropping': 'Modem sürekli kopuyor',
  'Email set-up on new phone': 'Yeni telefonda e-posta kurulumu',
  'Change of address': 'Adres değişikliği',
  'Add a user to the account': 'Hesaba kullanıcı ekleme',
  'PIN reset': 'PIN sıfırlama',
  'Upgrade eligibility': 'Yükseltme uygunluğu',
  'Wants to cancel': 'İptal etmek istiyor',
  'Out-of-contract price review': 'Taahhüt dışı fiyat değerlendirmesi',
  'Competitor offer': 'Rakip teklifi',
  'Overdue balance': 'Gecikmiş bakiye',
  'Payment plan request': 'Ödeme planı talebi',
  'Service restricted': 'Hizmet kısıtlandı',
  'Missed engineer visit': 'Gelmeyen teknisyen',
  'Repeat fault': 'Tekrarlayan arıza',
  'Wrong information given': 'Yanlış bilgi verilmiş',
}

// Turkish names shown for the simulated agents and team leaders, keyed by their English name.
export const NAMES_TR: Record<string, string> = {
  // Team leaders
  'Priya Raman': 'Pınar Erdem',
  'Marcus Oyelaran': 'Murat Özkan',
  'Elena Kovač': 'Elif Korkmaz',
  // Team Aster
  'Maya Lindholm': 'Melis Aydın',
  'Kwame Boateng': 'Kerem Bozkurt',
  'Chloe Varga': 'Ceren Yıldız',
  'Arjun Mehta': 'Arda Demir',
  'Isabel Ferreira': 'İpek Şahin',
  // Team Birch
  'Noor Al-Sayed': 'Nur Aksoy',
  'Liam Gallagher-Reid': 'Levent Güler',
  'Hana Kobayashi': 'Hande Koç',
  'Diego Paredes': 'Deniz Polat',
  // Team Cedar
  'Femi Adebayo': 'Fatih Arslan',
  'Sara Lund': 'Selin Kaya',
  'Viktor Hristov': 'Volkan Öztürk',
  'Aisha Rahman': 'Ayşe Çelik',
  'Tom Sinclair': 'Tolga Şimşek',
}
