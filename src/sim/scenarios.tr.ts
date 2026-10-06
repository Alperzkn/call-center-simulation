// Turkish text for the training scenarios. Structure and option order mirror scenarios.ts exactly;
// scores, mood changes and flags live only in the English file.

export interface ScenarioText {
  title: string
  customer: { name: string; tenure: string; product: string }
  crm: string[]
  policy: string[]
  opening: string
  steps: { prompt?: string; options: { text: string; reply: string; note: string }[] }[]
  dispositions: string[]
  takeaway: string
}

export const SCENARIOS_TR: Record<string, ScenarioText> = {
  'roaming-bill-shock': {
    title: 'Tatil dönüşü fatura şoku',
    customer: { name: 'Daniel Okafor', tenure: '8 yıl', product: 'Mobil 20GB, aylık 24 €' },
    crm: [
      'Son fatura 186,40 € (normal fatura 24,00 €)',
      '162,40 € yurt dışı veri kullanımı: Türkiye’de 1,4 GB, 12–19 Eylül',
      '13 Eylül: 50 € yurt dışı limit SMS’i gönderildi. Telefondan gelen yanıt: DEVAM',
      '8 yılda hesaba hiç iyi niyet indirimi uygulanmamış',
    ],
    policy: [
      'Limit kaldırıldıktan sonraki yurt dışı ücretleri geçerlidir ve tamamı silinmez',
      'İlk fatura şoku başvurusu: temsilci yurt dışı ücretinin %50’sine kadar iyi niyet indirimi yapabilir',
      'Kalan tutar en fazla 3 faturaya bölünebilir',
      'Seyahat Paketi: günlük 6 €, seyahatten önce uygulamadan eklenir',
    ],
    opening:
      'Merhaba. Faturamı az önce açtım, yüz seksen altı euro gelmiş. Ben yirmi dört ödüyorum. Biri hata yapmış ve bunun bugün düzeltilmesini istiyorum.',
    steps: [
      {
        options: [
          {
            text: 'Normal faturanıza göre çok büyük bir fark, hemen aramanızı anlıyorum. Faturayı sizinle satır satır inceleyeceğim. Hesabı açabilmem için adınızı, soyadınızı ve adresinizin ilk satırını alabilir miyim?',
            reply: 'Daniel Okafor, Marsh Lane 14. Peki. Nedir bu?',
            note: 'Herhangi bir şey istemeden önce sorunu kabul ediyor, sonra doğrulama yapıyor. Müşteri ilk on saniyede sizin onun tarafında olduğunuzu duyuyor.',
          },
          {
            text: 'Adınızı, soyadınızı ve adresinizin ilk satırını alabilir miyim lütfen?',
            reply: 'Daniel Okafor, Marsh Lane 14. Bunu çözecek misiniz, çözmeyecek misiniz?',
            note: 'Doğrulama doğru, ama hiçbir şekilde anlayış göstermemek üzgün müşterinin kendini daha yüksek sesle tekrar etmesine yol açar.',
          },
          {
            text: 'Faturalarımız otomatik oluşturuluyor, hata olması pek olası değil. Adınız nedir?',
            reply: 'Olası değil mi? Daha bakmadınız bile. Daniel Okafor, Marsh Lane 14.',
            note: 'Hesaba bakmadan şirketi savunmak, müşteriye ona inanılmadığını söyler. Ayrıca adres kontrolü atlandı.',
          },
        ],
      },
      {
        prompt: 'Fatura dökümünde 162,40 € yurt dışı veri kullanımı görünüyor.',
        options: [
          {
            text: 'Farkın ne olduğunu görüyorum: 162 eurosu 12–19 Eylül arasında yurt dışında kullanılan mobil veri. O tarihlerde seyahatte miydiniz?',
            reply: 'Bir haftalığına Antalya’daydım, evet. Ama kimse bana bu kadar tutacağını söylemedi. Harita kullandım, biraz da WhatsApp.',
            note: 'Net rakamlar, net tarihler ve müşterinin durumu seyahatle kendisinin ilişkilendirmesini sağlayan bir soru.',
          },
          {
            text: 'Yurt dışı kullanım ücretleri. Yurt dışında veri kullanmışsınız.',
            reply: 'Antalya’da, evet, bir hafta. Ama kimse bana bu kadar tutacağını söylemedi!',
            note: 'Doğru ama sert. Tutarı ve tarihleri verin ki müşteri kendi hatırladıklarıyla karşılaştırabilsin.',
          },
          {
            text: 'Paketinizin dışında 1,4 GB kullanmışsınız; bu da kabul ettiğiniz koşullar gereği standart tarifeden ücretlendirilir.',
            reply: 'Kabul ettiğim koşullar mı? Bir hafta Antalya’daydım ve kimse bana tek kelime etmedi!',
            note: 'Üzgün bir müşteriye sözleşme koşullarını okumak suçlama gibi algılanır. Önce açıklayın; sözleşme en son çaredir.',
          },
        ],
      },
      {
        prompt: 'Hesapta 13 Eylül tarihli 50 € limit SMS’i ve telefonundan gelen DEVAM yanıtı görünüyor.',
        options: [
          {
            text: 'Tatil dönüşü böyle bir fatura gerçekten kötü bir sürpriz. Gördüklerimi size açıkça söylemek istiyorum: 13 Eylül’de 50 euroluk yurt dışı limitine ulaştığınızda bir SMS göndermişiz ve telefonunuzdan verinin açık kalması için yanıt gelmiş. O mesajı hatırlıyor musunuz?',
            reply: '…Bir mesaj hatırlıyorum. Hoş geldiniz mesajı sandım, kapansın diye bir şeye bastım. Yani bunu ödemek zorunda mıyım?',
            note: 'Empati ve dürüstlük bir arada. Tatsız gerçeği suçlamadan söylüyor ve müşterinin yanıt vermesine izin veriyorsunuz.',
          },
          {
            text: '13’ünde size uyarı mesajı gönderdik ve devam yanıtı verdiniz, dolayısıyla ücretler geçerli.',
            reply: 'Kapansın diye bir şeye bastım. Yani bu kadar mı, ödemek zorunda mıyım?',
            note: 'Doğru ve müşterinin bunu duyması gerekiyor, ama hüküm verir gibi söylendi. Artık bir tartışma bekliyor.',
          },
          {
            text: 'Merak etmeyin, o ücretleri sildireceğim.',
            reply: 'Gerçekten mi? Hepsini mi? Bir dakika, geçen yıl bir arkadaşınız eşime bunu yapamayacağınızı söylemişti. Emin misiniz?',
            note: 'Yetkinizin dışında bir söz verdiniz. Müşterinin morali bir an yükselir, indirim gelmeyince çöker; sonuç tekrar arama ve şikâyettir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Ücretler geçerli olduğu için hepsini silemem. Ama sekiz yıldır bizimlesiniz ve bu ilk kez oluyor; bu yüzden yurt dışı ücretinin yarısını, yani 81 euroyu bugün iade edebilir, kalanını da sonraki üç faturanıza bölebilirim. Böyle yapayım mı?',
            reply: 'Yarısı… Doğrusu beklediğimden iyi. Evet, bölün. Ama bunun bir daha olmasını istemiyorum.',
            note: 'İyi niyet yetkisinin tamamını kullanıyor, neden hak ettiğini açıklıyor ve istenmeden taksit öneriyor.',
          },
          {
            text: 'Tutarın tamamını sizin için üç aya bölebilirim.',
            reply: 'Yani yine hepsini ödüyorum. Sekiz yıl, yapabildiğiniz bu mu? Peki. Bunun tekrar olmasını nasıl önlerim?',
            note: 'Geçerli bir seçenek, ama ilk kez yaşanan bir durum için %50 iyi niyet hakkınız vardı ve kullanmadınız. Şikâyet ya da iptal bekleyin.',
          },
          {
            text: 'İtiraz etmek isterseniz yazılı şikâyette bulunmanız gerekiyor.',
            reply: 'Yazılı mı? Şu an sizinle telefondayım. İnanılmaz. Sadece bunun tekrar olmasını nasıl önleyeceğimi söyleyin.',
            note: 'Çözülebilir bir çağrıyı şikâyet sürecine itmek daha pahalıdır ve müşteriyi kaybettirir. Politika izin veriyorsa ilk temasta çözün.',
          },
        ],
      },
      {
        options: [
          {
            text: 'İki şey var. Yurt dışı limitinizi yeniden açtım; bizi aramadığınız sürece veri 50 euroda duracak. Bir sonraki seyahatinizden önce de uygulamadan günlük 6 euroya Seyahat Paketi ekleyebilirsiniz. 81 euroluk iadeyi onaylayan SMS bir saat içinde gelecek. Yardımcı olabileceğim başka bir konu var mı?',
            reply: 'Hayır, hepsi bu. Bana açık konuştuğunuz için teşekkürler.',
            note: 'Sorunun nedenini gideriyor, müşterinin kontrol edebileceği net bir onay veriyor ve çağrıyı düzgün kapatıyor.',
          },
          {
            text: 'Bir dahaki sefere Seyahat Paketi alın. Başka bir şey var mı?',
            reply: 'Tamam. Hayır, bu kadar.',
            note: 'Tavsiye doğru, ama bugün ne yaptığınızın ve müşterinin bunu ne zaman göreceğinin özeti yok.',
          },
          {
            text: 'Ayarlardan veri dolaşımını kapatın. Halden’ı aradığınız için teşekkürler, iyi günler.',
            reply: '…Peki. İyi günler.',
            note: 'Özet yok, onay yok, başka soru var mı diye kontrol yok. İadenin yapılıp yapılmadığını sormak için tekrar arayacak.',
          },
        ],
      },
    ],
    dispositions: [
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Fatura: mükerrer ödeme, iade talebi açıldı',
      'Şikâyet: takım liderine aktarıldı',
      'Genel bilgi talebi',
    ],
    takeaway: 'Ne olduğu konusunda dürüst olun, sonra elinizdeki yetkiyi kullanın. Müşteriler adil bir kısmi çözümü, belirsiz bir sözden çok daha iyi karşılar.',
  },

  'broadband-outage': {
    title: 'Evden çalışırken internet kesintisi',
    customer: { name: 'Sofia Lindqvist', tenure: '2 yıl', product: 'Fiber 500 internet' },
    crm: [
      'Modem HL-6: bugün 08:42’den beri senkron yok',
      'Posta kodu için bildirilmiş bölgesel arıza yok',
      'Aynı hesaba bağlı bir Halden mobil hattı var',
      'En erken teknisyen randevusu: yarın 08:00–12:00',
    ],
    policy: [
      'Müşteriden herhangi bir sıfırlama istemeden önce uzaktan hat testi yapın',
      'Hat testi dış arıza gösteriyorsa asla fabrika ayarlarına sıfırlama istemeyin',
      'Tam kesinti: bağlı mobil hatta ücretsiz sınırsız veri tanımlayın (anında)',
      'Otomatik tazminat: hizmet 2 tam gün kesik kaldıktan sonra her tam gün için 5,50 €',
    ],
    opening:
      'Merhaba, internetim dokuzdan önce kesildi. Evden çalışıyorum ve saat ikide müşteri sunumum var. Modemi iki kez yeniden başlattım bile.',
    steps: [
      {
        options: [
          {
            text: 'Çok üzgünüm, saat ikide sunumunuz varken olabilecek en kötü zamanlama. Sunuma çevrimiçi katılabilmeniz için bir yol bulalım. Hattı açabilmem için adınızı ve posta kodunuzu alabilir miyim?',
            reply: 'Sofia Lindqvist, posta kodunun sonu 4QT. Teşekkür ederim.',
            note: 'Müşteri için asıl önemli olan teslim saatini yakalıyor ve çağrıyı onun etrafında kuruyor.',
          },
          {
            text: 'Bunu duyduğuma üzüldüm. Adınızı ve posta kodunuzu alabilir miyim?',
            reply: 'Sofia Lindqvist, posta kodunun sonu 4QT.',
            note: 'Sorun yok, ama size bir saat verdi ve duyduğunuzu göstermediniz.',
          },
          {
            text: 'Tamam. Her şeyden önce, modemi prizden otuz saniyeliğine kapatıp açar mısınız?',
            reply: 'Bunu iki kez yaptığımı az önce söyledim. Sofia Lindqvist, 4QT. Hatta gerçekten bakabilir misiniz?',
            note: 'Ne denediğini size söylemişti. Müşteriye adımları tekrarlatmak senaryo okuduğunuzu gösterir; üstelik henüz doğrulama yapmamıştınız.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Teşekkürler Sofia Hanım. İki kez yeniden başlatmışsınız, bunu tekrar istemeyeceğim. Şu an modemin ön yüzünde hangi ışıklar yanıyor?',
            reply: 'Güç ışığı yeşil, dünya simgeli olan kırmızı. Sabahtan beri kırmızı.',
            note: 'Yaptıklarını takdir ediyor ve arızayı daraltan tek soruyu soruyor.',
          },
          {
            text: 'Tüm cihazlarınızda mı sorun var, yoksa sadece dizüstü bilgisayarınızda mı?',
            reply: 'Hepsinde. Yardımı olacaksa, modemdeki dünya ışığı kırmızı.',
            note: 'Makul bir soru, ancak ekranınızdaki modem durumu zaten senkron olmadığını gösteriyor.',
          },
          {
            text: 'Son faturanızı ödediniz mi? Bazen ödenmeyen fatura yüzünden hizmet kısıtlanıyor.',
            reply: 'Evet, faturamı ödedim. Modemdeki dünya ışığı kırmızı. Bu sizin ekranınızda görünmüyor mu?',
            note: 'Hesap durumu önünüzde. Borcu olmayan bir müşteriye ödeme sormak hem kırıcıdır hem zaman kaybettirir.',
          },
        ],
      },
      {
        prompt: 'Kırmızı dünya ışığı, modeme sinyal ulaşmadığı anlamına gelir. Uzaktan hat testi yapabilirsiniz (yaklaşık 40 saniye).',
        options: [
          {
            text: 'Kırmızı dünya ışığı modeme sinyal gelmediğini gösteriyor, bu yüzden hattı buradan test edeceğim. Yaklaşık kırk saniye sürüyor, test bitene kadar hatta sizinleyim.',
            reply: 'Peki… Ne diyor?',
            note: 'Önce doğru araç; müşteri de sessizliğin ne kadar süreceğini ve nedenini biliyor.',
          },
          {
            text: 'Bir şeye bakarken sizi kısa bir süre beklemeye alıyorum.',
            reply: 'Alo? …Tamam, döndünüz. Ne buldunuz?',
            note: 'Test doğru, bekletme yanlış. Açıklanmayan bekletmeler düşük memnuniyet puanlarının en büyük nedenlerinden biridir; ne yaptığınızı ve ne kadar süreceğini söyleyin.',
          },
          {
            text: 'Arkadaki küçük sıfırlama deliğini bulup bir ataçla on saniye basılı tutar mısınız? Bu, fabrika ayarlarına döndürür.',
            reply: 'Yaptım. Şimdi kurulum şifresi istiyor ve dünya ışığı hâlâ kırmızı. Daha kötü oldu.',
            note: 'Fabrika ayarlarına sıfırlama dış hat arızasını gideremez ve müşterinin Wi-Fi ayarlarını sildi. Her zaman önce hat testi yapın.',
          },
        ],
      },
      {
        prompt: 'Hat testi sonucu: saha dolabı ile bina arasında arıza tespit edildi. Teknisyen ziyareti gerekli.',
        options: [
          {
            text: 'Test, evinizin dışındaki hatta bir arıza gösteriyor; yani içeride yapacağınız hiçbir şey bunu düzeltmez. Yarın 8 ile 12 arasına teknisyen ayarlayabilirim. Bugün için de Halden mobil hattınıza hemen sınırsız veri tanımlayabilirim, sunum için dizüstü bilgisayarınıza telefonunuzdan internet paylaşırsınız. İkisini de yapayım mı?',
            reply: 'Evet, lütfen, ikisini de. İnternet paylaşabileceğimi bilmiyordum. Öğleden sonramı kurtardınız.',
            note: 'Hem arızayı hem teslim saatini çözüyor. Kötü bir günü iyi bir çağrıya çeviren şey veri tanımlamasıdır.',
          },
          {
            text: 'Binanızın dışında bir arıza var. En erken teknisyen yarın 8 ile 12 arasında, randevu oluşturayım mı?',
            reply: 'Yarın mı? Peki bugün saat iki için ne yapacağım? …Oluşturun bari.',
            note: 'Teşhis ve randevu doğru, ama politika size anında bir geçici çözüm verirken müşterinin acil sorununu çözümsüz bıraktınız.',
          },
          {
            text: 'Bu öğleden sonra size bir teknisyen göndereceğim, merak etmeyin.',
            reply: 'Bu öğleden sonra mı? Harika. Saat kaçta?',
            note: 'En erken randevu yarın. Tutamayacağınız bir söz, ikinci ve daha öfkeli bir aramayı ve kaçırılmış randevu şikâyetini garantiler.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Özetle: teknisyen yarın 8 ile 12 arasında gelecek, yola çıktığında SMS atacak. Sınırsız veri mobil hattınızda şu an aktif ve hat onarılana kadar kalacak. Perşembeye kadar çalışmazsa faturanızdan otomatik olarak günlük 5,50 euro düşülecek. İnternet paylaşımını denerken hatta kalmamı ister misiniz?',
            reply: 'Bağlandı. Mükemmel. Teşekkürler, gerçekten.',
            note: 'Randevuyu, geçici çözümü ve tazminatı dürüstçe özetliyor; müşteriyi bırakmadan önce çözümün çalıştığını kontrol ediyor.',
          },
          {
            text: 'Randevunuz oluşturuldu. Ayrıntılar SMS ile gelecek. Başka bir şey var mı?',
            reply: 'Hayır, bu kadar. Teşekkürler.',
            note: 'Yeterli. Randevu saatini sözlü olarak özetlemek, müşteriyi SMS beklemekten kurtarırdı.',
          },
          {
            text: 'Kesinti için ayrıca tazminat alacaksınız. Aradığınız için teşekkürler.',
            reply: 'Ne kadar? Ne zaman? …Alo?',
            note: 'Tazminat ancak iki tam günden sonra başlar. Belirsiz bir söz yanlış beklenti yaratır; üstelik çağrıyı bir soru üzerine kapattınız.',
          },
        ],
      },
    ],
    dispositions: [
      'Teknik: arıza, teknisyen randevusu verildi',
      'Teknik: çağrıda çözüldü',
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Genel bilgi talebi',
    ],
    takeaway: 'Kesintinin müşteriye bugün neye mal olduğunu öğrenin. Hattı onarmak yarının işi; onu çalışır durumda tutmak bu çağrının işi.',
  },

  'sim-swap-fraud': {
    title: 'Arayan SIM değişikliği istiyor ama güvenliği geçemiyor',
    customer: { name: 'Arayan kişi Peter Hallam olduğunu söylüyor', tenure: '6 yıl', product: 'Mobil Sınırsız' },
    crm: [
      'Hesap sahibi: Peter Hallam. Hesap PIN’i tanımlı',
      'Bugün canlı sohbette 2 başarısız PIN denemesi',
      'Arayan numara: gizli',
      'Kayıtlı kayıp veya çalıntı bildirimi yok',
    ],
    policy: [
      'SIM değişikliği için hesap PIN’i ya da iki güvenlik sorusunun da doğru yanıtı gerekir',
      'Ad, doğum tarihi ve adres yeterli değildir: bunlar kolayca bulunabilir',
      'Asla ipucu vermeyin; hesapta kayıtlı hiçbir bilgiyi okumayın veya doğrulamayın',
      'Başarısız doğrulamadan sonra: fotoğraflı kimlikle mağaza ziyareti önerin. Her arayan bir SIM’in kapatılmasını isteyebilir',
      'Hesaba dolandırıcılık izleme notu ekleyin ve dolandırıcılık masasına bildirin',
    ],
    opening:
      'Merhaba. Telefonumu kaybettim, elimde eski bir paketten kalma yedek bir SIM var. Numaramı ona taşımanız yeterli. Adım Peter Hallam.',
    steps: [
      {
        options: [
          {
            text: 'Telefonunuzu kaybettiğinize üzüldüm Peter Bey. Bu konuda yardımcı olabilirim. Numara taşıma güvenlikli bir işlem olduğu için önce hesap PIN’inize ihtiyacım var.',
            reply: 'Ah. Onu hiç hatırlayamam. Bakın, doğum tarihimi ve adresimi verebilirim, onlar aklımda. 4 Mart 1979, Calder Road 22.',
            note: 'Yardımsever bir ton ve SIM değişikliği için doğrudan doğru güvenlik seviyesi.',
          },
          {
            text: 'Elbette. Doğum tarihinizi ve adresinizi alabilir miyim?',
            reply: '4 Mart 1979, Calder Road 22. Buyurun. Artık numarayı taşıyabilir misiniz?',
            note: 'Bu bilgiler hesabı bulmanızı sağlar ama SIM değişikliğine yetki vermez. Hâlâ PIN gerekiyor ve arayana güvenliği geçtiği izlenimini verdiniz.',
          },
          {
            text: 'Hiç sorun değil. Yeni SIM kartın üzerindeki numara nedir?',
            reply: 'Harika, 8944 1200 0031 7765. Bir de bilginiz olsun, doğum tarihim 4 Mart 1979.',
            note: 'Hiçbir güvenlik kontrolü olmadan değişikliği başlattınız. SIM değişikliği, banka kodları dahil tüm SMS’leri karşı tarafa teslim eder.',
          },
        ],
      },
      {
        prompt: 'Ad, doğum tarihi ve adres hesapla eşleşiyor. PIN verilmedi.',
        options: [
          {
            text: 'Teşekkür ederim. Bunlar eşleşiyor, ancak SIM değişikliği için PIN’e ya da iki güvenlik sorunuzun yanıtına ihtiyacım var. İsterseniz soruları şimdi sorabilirim.',
            reply: 'Güvenlik soruları… Onları yıllar önce belirlemiştim. Hesaptaki e-posta adresini söyleyin, PIN’i oradan kendim sıfırlarım.',
            note: 'Kuralından ödün vermiyor ve soruların ne olduğunu açık etmeden meşru alternatifi sunuyor.',
          },
          {
            text: 'Maalesef bu yeterli değil. PIN’in aşağı yukarı ne olabileceğini hatırlıyor musunuz? Dört haneli.',
            reply: 'Dört hane, tamam. Şu an aklıma gelmiyor. Hesaptaki e-postayı söyleyin, kendim sıfırlarım.',
            note: 'Kararlı durdunuz ama PIN’in uzunluğunu doğruladınız. Birkaç aramada bilgi toplayan biri için küçük ipuçları birikir.',
          },
          {
            text: 'Hepsi bendeki bilgilerle eşleşiyor, sorun yok. Numarayı şimdi taşıyorum.',
            reply: 'Çok güzel. Hazır elinizdeyken, bende hangi e-posta kayıtlı?',
            note: 'Doğum tarihi ve adres sosyal medyada, postada ve veri sızıntılarında bulunur. Bunları SIM değişikliği için kabul etmek, hesap ele geçirmenin tam olarak nasıl gerçekleştiğidir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Güvenliği geçmeden hesaptaki hiçbir bilgiyi okuyamam veya doğrulayamam. Ama bunu bugün çözmenin iki yolunu söyleyebilirim: başka bir cihazda oturumunuz açıksa Halden uygulamasındaki PIN sıfırlama bağlantısı ya da fotoğraflı kimlikle herhangi bir Halden mağazası.',
            reply: 'Mağaza mı? Mağazaya gidecek vaktim yok. Annem hastanede ve beni o numaradan aramaya çalışıyorlar. Gerçekten hastaneyle konuşmama engel mi olacaksınız?',
            note: 'Hiçbir bilgi verilmiyor, ama arayanın önünde gerçek bir yol var. Gerçek müşteri bu yolu kullanabilir; dolandırıcı kullanamaz.',
          },
          {
            text: 'Hayır, bunu söyleyemem.',
            reply: 'Çok yardımcı oldunuz. Annem hastanede ve beni o numaradan aramaya çalışıyorlar. Gerçekten hastaneyle konuşmama engel mi olacaksınız?',
            note: 'Kurallara uygun, ama gerçek bir müşteri çaresiz kalırdı. Reddederken mutlaka ne yapabileceğini de söyleyin.',
          },
          {
            text: 'Adresin tamamını veremem ama p.hall ile başlıyor ve bir Gmail hesabı.',
            reply: 'p.hall, Gmail. Anladım, teşekkürler. Neyse, annem hastanede ve beni o numaradan aramaya çalışıyorlar, biraz hızlanabilir miyiz?',
            note: 'E-postanın bir kısmı bile doğrulanmamış bir arayana kişisel veri ifşasıdır ve parola sıfırlama için o posta kutusunu hedef almaya yeter.',
          },
        ],
      },
      {
        prompt: 'Aciliyet ve suçluluk duygusu klasik baskı taktikleridir; ama gerçekten zor durumdaki bir müşteri de böyle konuşur. Hangisi olduğunu bilemezsiniz.',
        options: [
          {
            text: 'Anneniz için üzgünüm ve size ulaşılabilmesini gerçekten istiyorum. Güvenlik doğrulaması olmadan numarayı taşıyamam, çünkü bir başkasının numaranızı almasını engelleyen tek şey bu kontrol. Şu an yapabileceğim şey, kayıp SIM’i kimse kullanamasın diye kapatmak; mağaza da fotoğraflı kimlikle numarayı on dakikada taşır. SIM’i kapatmamı ister misiniz?',
            reply: 'Boş verin. Kendim hallederim.',
            note: 'Nazik ve sarsılmaz. Hikâyeyi doğru olabilirmiş gibi ele alıyor, kontrolün neyi koruduğunu açıklıyor ve izin verilen koruyucu işlemi öneriyorsunuz.',
          },
          {
            text: 'Anlıyorum ama kural kuraldır. Yapabileceğim bir şey yok.',
            reply: 'İşe yaramazsınız. Boş verin.',
            note: 'Kurallara uydunuz. Ama “yapabileceğim bir şey yok” doğru değil: SIM’i kapatabilir ve mağaza yolunu anlatabilirdiniz.',
          },
          {
            text: 'Ah, çok üzgünüm. Durum böyle olunca bu seferlik bir istisna yapıp numarayı taşıyacağım.',
            reply: 'Teşekkürler, hayatımı kurtardınız. SIM numarası 8944 1200 0031 7765.',
            note: 'Duygusal bir hikâye doğrulama değildir. Baskı altında yapılan istisnalar, SIM değişikliği dolandırıcılığındaki kayıpların en yaygın nedenidir.',
          },
        ],
      },
      {
        prompt: 'Arayan telefonu kapattı. Bir sonraki çağrıyı almadan önce ne yaparsınız?',
        options: [
          {
            text: 'Saati, gizli numarayı ve ne istendiğini içeren bir dolandırıcılık izleme notu eklerim, bunu iki başarısız sohbet denemesiyle ilişkilendirir ve dolandırıcılık masasına bildiririm.',
            reply: 'Dolandırıcılık masası SIM değişikliklerine 72 saatlik kilit koyuyor ve gerçek Peter Hallam’a hesabını kontrol etmesi için SMS gönderiyor.',
            note: 'Bir günde üç deneme bir örüntüdür. Dördüncü denemenin bir arkadaşınızda başarıya ulaşmasını engelleyen şey sizin notunuzdur.',
          },
          {
            text: 'Hesaba kısa bir not eklerim: “Arayan güvenliği geçemedi, mağazaya yönlendirildi.”',
            reply: 'Not kaydedildi. Kimseye haber verilmedi, ama en azından bir sonraki temsilci notu görecek.',
            note: 'Hiç yoktan iyidir. Dolandırıcılık bildirimi olmadan kimse bunu önceki sohbet denemeleriyle ilişkilendirmez ve müşteriyi uyarmaz.',
          },
          {
            text: 'Bir şey gerekmez. Değişiklik yapılmadı, kaydedilecek bir şey yok.',
            reply: 'Hesapta çağrıdan hiçbir iz yok. Bir saat sonra aynı kişi başka bir temsilciye ulaşıyor.',
            note: 'Başarısız bir deneme de bir denemedir. Not olmayınca bir sonraki temsilcinin hiçbir uyarısı olmaz.',
          },
        ],
      },
    ],
    dispositions: [
      'Güvenlik: doğrulama başarısız, dolandırıcılık bildirimi',
      'Hesap: SIM değişikliği tamamlandı',
      'Genel bilgi talebi',
      'Şikâyet: takım liderine aktarıldı',
    ],
    takeaway: 'Arayanın dürüst olup olmadığına siz karar vermiyorsunuz. Herkese aynı kontrolü uyguluyorsunuz; böylece hatta kim olursa olsun sonuç aynı oluyor.',
  },

  'retention-competitor-offer': {
    title: 'Müşteri daha ucuz bir teklif için iptal etmek istiyor',
    customer: { name: 'Amara Nwosu', tenure: '5 yıl', product: 'Fiber 500, aylık 42 €, taahhütsüz' },
    crm: [
      'Mart’tan beri taahhüt dışı. Fiyat Nisan’da 35 €’dan 42 €’ya çıktı',
      'Son 12 ayda kayıtlı arıza yok',
      'Hane kullanımı: yoğun yayın izleme, 14 bağlı cihaz',
    ],
    policy: [
      'Sadakat fiyatı: yeni 12 aylık taahhütle aylık 32 € (verilebilecek en düşük fiyat)',
      'Her yeni taahhütte Fiber 900’e ücretsiz yükseltme',
      'Mutlaka belirtin: taahhüt süresi, aylık fiyat ve 14 günlük cayma hakkı',
      'İptal: 30 gün önceden bildirim, ücret yok. İptal talebini asla engellemeyin',
    ],
    opening:
      'Merhaba, internet aboneliğimi iptal etmek istiyorum lütfen. Brightline’dan aylık yirmi dokuz euroya teklif aldım, size kırk iki ödüyorum.',
    steps: [
      {
        options: [
          {
            text: 'Elbette, bu konuda yardımcı olabilirim. Önce adınızı ve posta kodunuzu alabilir miyim? Uygun görürseniz, karar vermeden önce fiyat konusunda ne yapabileceğimize de bakmak isterim.',
            reply: 'Amara Nwosu, posta kodunun sonu 7RB. Bakabilirsiniz ama aşağı yukarı kararımı verdim.',
            note: 'Talebi kabul ediyor, doğrulama yapıyor ve alternatiflere bakmak için izin istiyor. Direnç yok, dolayısıyla savunma da yok.',
          },
          {
            text: 'Adınızı ve posta kodunuzu alabilir miyim lütfen?',
            reply: 'Amara Nwosu, posta kodunun sonu 7RB. Bilginiz olsun, aşağı yukarı kararımı verdim.',
            note: 'Doğru, ama talebi kabul edip kapıyı aralama fırsatını kaçırdınız.',
          },
          {
            text: 'İptal mi? Beş yıldan sonra mı? Brightline’ın şebekesi bizimkinden çok daha güvenilmezdir, biliyorsunuz.',
            reply: 'Satış konuşması dinlemek için aramadım. Amara Nwosu, 7RB. Aşağı yukarı kararımı verdim.',
            note: 'Doğrulama yapmadan rakibi kötülemek ve müşterinin kararını sorgulamak. Artık sizi dinlemek yerine sizinle tartışıyor.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Teşekkürler Amara Hanım. Beş yıldır bizimlesiniz ve bu yıl hiç arıza kaydınız yok; hizmetin kendisinden memnunsunuz diye düşünüyorum. Sebep yalnızca fiyat mı, yoksa değiştirmek isteyeceğiniz başka bir şey var mı?',
            reply: 'Hizmet iyi, doğrusu. Mesele fiyat. Nisan’da arttı, kimse nedenini söylemedi; sonra onların reklamını gördüm. Değerim bilinmiyormuş gibi hissettim.',
            note: 'Tek bir açık uçlu soru gerçek nedeni ortaya çıkarıyor: on üç euro değil, değerinin bilinmediğini hissetmesi.',
          },
          {
            text: 'Ayrılmanızın tek nedeni fiyat mı?',
            reply: 'Büyük ölçüde. Nisan’da arttı, kimse nedenini söylemedi. Değerim bilinmiyormuş gibi hissettim.',
            note: 'Şans eseri işe yarayan kapalı uçlu bir soru. Açık uçlu bir soru, olguyla birlikte duyguyu da bulurdu.',
          },
          {
            text: 'On iki ay daha taahhüt verirseniz size aylık 32 euro önerebilirim.',
            reply: 'Yani bunca zaman o fiyatı uygulayabilirdiniz, öyle mi? Nisan’da arttı, kimse nedenini söylemedi. Değerim bilinmiyor gibi hissediyorum.',
            note: 'Neden ayrıldığını anlamadan indirimle başlamak, teklifi fazla ödediğinin kanıtı gibi gösterir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Haklısınız, bunu bir reklamdan öğrenmek zorunda kalmamalıydınız. Nisan’ı değiştiremem ama bugünden itibaren düzeltebilirim: on iki ay boyunca aylık 32 euro ve Fiber 500’den Fiber 900’e ücretsiz yükseltme; evde on dört cihazla bu işinize yarar. Şu ankinden ayda on euro daha az.',
            reply: 'Bu daha yakın. Ama yine de Brightline’dan üç euro fazla.',
            note: 'Şikâyeti kabul ediyor, sonra teklifi fiyat listesi okumak yerine müşterinin hanesine göre kuruyor.',
          },
          {
            text: 'On iki aylık taahhütle aylık 32 euro yapabilirim. En iyi fiyatımız bu.',
            reply: 'Yine de Brightline’dan üç euro fazla.',
            note: 'Fiyat doğru, ama yükseltme ve müşterinin anlattıklarıyla bir bağlantı yok. Bu teklifi tercih etmesi için bir neden vermediniz.',
          },
          {
            text: '29 euroyu sizin için eşitleyeceğim.',
            reply: 'A! Bu her şeyi değiştirir. Yalnız… buna gerçekten izin var mı? Sitenizde yazandan üç euro düşük.',
            note: 'Alt sınır 32 €. Sisteme giremeyeceğiniz bir teklif, gelecek ay bir fatura itirazına dönüşür.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Haklısınız, üç euro fazla; aksini iddia etmektense bunu açıkça söylemeyi tercih ederim. Karşılığında bütün yıl arıza yapmamış bir hat, neredeyse iki katı hız elde ediyor ve geçiş günü kesintisiyle uğraşmıyorsunuz. Brightline’ın fiyatının on ikinci aydan sonra ne olduğuna da bakmanızı öneririm. Karar her durumda sizin; yine de iptal etmek isterseniz hemen, zorluk çıkarmadan yaparım.',
            reply: '…Bir yıl sonra kırk beşe çıktığına dair bir şey görmüştüm. Bir gün internetsiz kalmak da istemem. Peki. Otuz ikiyi yapalım.',
            note: 'Doğru noktayı kabul ediyor, somut gerekçeler sunuyor ve kararı müşteriye bırakıyor. Teklifi inandırıcı kılan şey baskı olmamasıdır.',
          },
          {
            text: 'Sadece üç euro. Bunun için geçiş zahmetine değer mi gerçekten?',
            reply: 'Yılda otuz altı euro ediyor aslında. Ama… bir gün internetsiz kalmak istemem. Peki, otuz ikiyi alıyorum.',
            note: 'İşe yaradı, ama müşterinin parasını küçümsemek risklidir. Ona neyin önemli olması gerektiğini söylemek yerine gerekçe sunun.',
          },
          {
            text: 'İptal ederseniz otuz gün önceden bildirmeniz ve modemi iade etmeniz gerekir, yoksa 60 euro ücret yansır; ayrıca sabit hat numaranızı kaybedebilirsiniz.',
            reply: 'Bu bir tehdit mi? …Peki. Şimdilik otuz ikiyi alıyorum. Ama söyleniş biçiminden memnun değilim.',
            note: 'Ayrılma koşullarını caydırıcı olarak kullanmak engellemedir. Bugün hesabı kurtarabilir, yarın şikâyet doğurur.',
          },
        ],
      },
      {
        prompt: 'Müşteri teklifi kabul etti. Siparişi girmeden önce temel koşulları okumalısınız.',
        options: [
          {
            text: 'Onaylamadan önce: bu, aylık 32 euroluk yeni bir 12 aylık taahhüt; Fiber 900 24 saat içinde aktif olacak. 14 gün içinde hiçbir ücret ödemeden vazgeçebilirsiniz; tüm bunları şimdi e-postayla gönderiyorum. Devam etmemi onaylıyor musunuz?',
            reply: 'Evet, devam edin. İşi zorlaştırmadığınız için teşekkürler.',
            note: 'Süre, fiyat ve cayma hakkı belirtildi, açık onay alındı. Satışı geçerli kılan budur.',
          },
          {
            text: 'Harika, bir sonraki faturanızdan itibaren aylık 32 euro; yüksek hız da yarın devreye girecek. Ayrıntıları e-postayla göndereceğim.',
            reply: 'Tamam, teşekkürler.',
            note: '12 aylık taahhüdü ve 14 günlük cayma hakkını söylemediniz. Gerçek bir kalite formunda, müşteri memnun olsa bile bu bir uyum hatasıdır.',
          },
          {
            text: 'Mükemmel, her şey tamam. Halden’da kaldığınız için teşekkürler!',
            reply: 'Ha. Peki. İyi günler.',
            note: 'Zorunlu koşulların hiçbiri okunmadan ve açık onay alınmadan taahhüt girildi. Satış iptal edilebilir ve yanıltıcı satış olarak raporlanır.',
          },
        ],
      },
    ],
    dispositions: [
      'Elde tutma: müşteri kazanıldı',
      'Elde tutma: iptal işleme alındı',
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Genel bilgi talebi',
    ],
    takeaway: 'İnsanlar nadiren yalnızca fiyat yüzünden ayrılır. Asıl kırgınlığı bulun, karşılaştırmada dürüst olun ve hayır demeyi kolaylaştırın.',
  },

  bereavement: {
    title: 'Vefat eden eşin hesabını kapatma',
    customer: { name: 'Margaret Doyle (Thomas Doyle için arıyor)', tenure: '11 yıl', product: 'Mobil ve Fiber 100 internet' },
    crm: [
      'Hesap sahibi: Thomas Doyle',
      'İki hizmet: kendisinin mobil hattı ve ev interneti',
      'Bakiye: 38,00 €, son ödeme ayın 14’ü',
      'Mobil hat 24 aylık taahhüdün 7. ayında',
    ],
    policy: [
      'Vefat: hesap sahibinin PIN’ini veya güvenlik yanıtlarını sormayın',
      'Arayanın adını, yakınlık derecesini ve vefat tarihini alın. Bakiye 200 €’nun altındaysa belge gerekmez',
      'Tüm erken fesih ücretleri silinir. 50 €’nun altındaki bakiye silinir',
      'İnternet, yeni taahhüt olmadan arayanın adına devredilebilir',
      'Sesli mesajların ve mesajların kaydedilebilmesi için numara 30 gün ücretsiz açık tutulabilir',
      'Vefat çağrısında asla ürün veya yükseltme önermeyin',
    ],
    opening:
      'Merhaba. Ben… eşimin telefonu için arıyorum. Thomas. Üç hafta önce vefat etti ve faturaları gelmeye devam ediyor. Ne yapmam gerektiğini pek bilmiyorum.',
    steps: [
      {
        options: [
          {
            text: 'Thomas Bey için çok üzgünüm Margaret Hanım, başınız sağ olsun. Ne yapmanız gerektiğini bilmek zorunda değilsiniz, ben bunun için buradayım. Adım adım ilerleyeceğiz, hiç acelemiz yok.',
            reply: 'Teşekkür ederim. Çok naziksiniz. Bu aramalardan çok çekiniyordum.',
            note: 'Eşinin adını kullanıyor, süreci bilme yükünü müşteriden alıyor ve tempoyu yavaşlatıyor. Vefat çağrılarında işlem süresi hedefleri uygulanmaz.',
          },
          {
            text: 'Başınız sağ olsun. Hesabı kapatmanıza yardımcı olabilirim.',
            reply: 'Teşekkür ederim. Doğrusu bu aramalardan çok çekiniyordum.',
            note: 'Kibar, ama kalıp bir cümlenin hemen ardından işe geçildi. Burada bir an durmanın hiçbir maliyeti yok.',
          },
          {
            text: 'Tamam. Hesap PIN’ini veya güvenlik sorularının yanıtlarını alabilir miyim lütfen?',
            reply: 'Ben… PIN’ini bilmiyorum. Bunların hepsiyle o ilgilenirdi. Kusura bakmayın, hiçbirini bilmiyorum.',
            note: 'Hiçbir taziye yok ve müşteriden sahip olması imkânsız bir şey istediniz. Vefat süreci, kimse bunu duymak zorunda kalmasın diye var.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Thomas Bey’in hiçbir şifresine ihtiyacınız olmayacak. Sizden yalnızca üç şey rica ediyorum: adınız ve soyadınız, Thomas Bey’e yakınlığınız ve vefat ettiği tarih.',
            reply: 'Margaret Doyle. Eşiyim. 15 Eylül’dü.',
            note: 'Tam olarak vefat doğrulaması; önceden açıklandığı için hiçbiri sarsıcı gelmiyor.',
          },
          {
            text: 'Hesaptaki adresi doğrulayabilir misiniz? Bir de vefat belgesinin bir kopyasını bize e-postayla gönderebilir misiniz?',
            reply: 'Orchard Close 3. Belge… Elimde tek kopya var, e-postam da yok. Ben Margaret, eşiyim. 15 Eylül’de vefat etti.',
            note: '200 €’nun altında belge gerekmez. Göndermesi gerekmeyen bir belgeyi istemek, zaten bunalmış birine yeni bir iş çıkarır.',
          },
          {
            text: 'Maalesef hesap hakkında yalnızca hesap sahibiyle ya da vekâleti olan biriyle görüşebilirim.',
            reply: 'Hesap sahibi öldü. Zaten bu yüzden arıyorum. Ben Margaret, eşiyim. 15 Eylül’de vefat etti.',
            note: 'Standart veri koruma senaryosunu bir vefat durumuna uygulamak, sektörde en çok şikâyet edilen hatalardan biridir.',
          },
        ],
      },
      {
        prompt: 'Hesapta eşinin mobil hattı ve ev interneti var.',
        options: [
          {
            text: 'Teşekkür ederim Margaret Hanım. Hesapta iki şey var: Thomas Bey’in mobil hattı ve evdeki internet. İnterneti siz kullanıyor musunuz? Kullanıyorsanız doğrudan sizin adınıza alabilirim; fiyat aynı kalır, başka hiçbir şey değişmez.',
            reply: 'Ah, evet. Torunlarla görüntülü konuşmak için kullanıyorum. Onu da kaybedeceğimi sanmıştım. Evet, lütfen o kalsın. İhtiyacım olmayan yalnızca onun telefonu.',
            note: 'Müşterinin sormayı düşünmediği şeyi fark ediyor ve endişeyi daha oluşmadan gideriyor.',
          },
          {
            text: 'Her şeyi mi kapatmak istiyorsunuz, yoksa yalnızca mobil hattı mı?',
            reply: 'Her şeyi mi? İnternet de orada mı? Torunlar için ona ihtiyacım var. Yalnızca onun telefonu, lütfen.',
            note: 'Yanıtı alıyor, ama internetin de tehlikede olduğunu müşteri kendi başına fark etmek zorunda kaldı.',
          },
          {
            text: 'Hazır hattayken, internetin sizin adınıza geçmesi gerekecek; şu an sizin için Fiber 500 ve SIM içeren çok iyi bir kampanyamız da var.',
            reply: 'Kampanya istemiyorum. Eşimin faturalarının gelmesinin durmasını istiyorum.',
            note: 'Vefat çağrısında satış yapmak yasaktır ve teklif ne kadar iyi olursa olsun son derece uygunsuzdur.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Mobil hattı hiçbir ödeme çıkmadan kapatacağım: iptal ücreti yok, hesaptaki 38 euroyu da sildim. Kapatmadan önce bir konu var: numara kapanınca sesli mesaj karşılaması ve kayıtlı mesajlar silinir. Bir şeyleri kaydetmek için zamana ihtiyacınız olursa hattı 30 gün ücretsiz açık tutabilirim.',
            reply: '…Telesekreterde onun sesi var. Hiç düşünmemiştim. Evet. Evet, lütfen bir süre açık kalsın. Kızımız nasıl kaydedileceğini bilir.',
            note: 'Politikanın izin verdiği her şeyi siliyor ve numarayı kapatmanın müşteri için ne anlama geldiğini düşünüyor. Hatırlayacağı kısım bu olacak.',
          },
          {
            text: 'Mobil hattı kapattım, iptal ücreti yok. Kalan 38 euro da silindi.',
            reply: 'Ah. Teşekkür ederim. Hemen… kapandı mı? Telesekreter mesajı ondaydı. Neyse.',
            note: 'Mali açıdan doğru ve hızlı. Bu çağrıda amaç hız değildi; sesli mesaj artık geri getirilemez.',
          },
          {
            text: 'Mobil hat 2027’ye kadar taahhütlü, bu yüzden 204 euro erken fesih ücreti ve ayrıca 38 euro bakiye var.',
            reply: 'İki yüz… Ben… O öldü. Bu doğru olamaz, değil mi?',
            note: 'Vefat durumunda fesih ücretleri her zaman silinir ve bu büyüklükte bir bakiye de silinir. Bu, resmî bir şikâyete dönüşür.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Bundan sonra şunlar olacak Margaret Hanım. İnternet bugünden itibaren sizin adınıza. Thomas Bey’in numarası 6 Kasım’a kadar açık kalacak, sonra kendiliğinden kapanacak. Bunu onaylayan, sizin adınıza yazılmış tek bir mektup alacaksınız; onun adına başka hiçbir şey gelmeyecek. Bir şeye ihtiyacınız olursa adım o mektupta yazıyor. Lütfen kendinize iyi bakın.',
            reply: 'Teşekkür ederim. Bankadakinden çok daha kolay oldu sayenizde. Hoşça kalın evladım.',
            note: 'Tarihleri içeren net bir özet, birçok mektup yerine tek bir mektup ve standart kapanış yerine insani bir veda.',
          },
          {
            text: 'Hepsi halledildi. Postayla bir onay mektubu alacaksınız. Kendinize iyi bakın.',
            reply: 'Teşekkür ederim. Hoşça kalın.',
            note: 'Sorun yok, ama ayrıntıları büyük olasılıkla unutacak. Tarihleri ve postadan ne geleceğini söylemek, ikinci bir zor aramayı önler.',
          },
          {
            text: 'Bugün size yardımcı olabileceğim başka bir konu var mı? Yok mu? O hâlde Halden’ı aradığınız için teşekkürler, harika bir gün dilerim!',
            reply: '…Evet. Hoşça kalın.',
            note: 'Standart neşeli kapanış, vefat çağrısında rahatsız edicidir. Nasıl bir çağrıda olduğunuzu dinleyin.',
          },
        ],
      },
    ],
    dispositions: [
      'Hesap: vefat',
      'Elde tutma: iptal işleme alındı',
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Genel bilgi talebi',
    ],
    takeaway: 'Vefat çağrısında süreç insana göre esner. İdari yükü müşterinin üzerinden alın, yavaşlayın ve hesabın bakiyeden başka neler barındırdığını düşünün.',
  },

  'irate-missed-engineer': {
    title: 'Gelmeyen teknisyen için üçüncü arama',
    customer: { name: 'Rob Castellano', tenure: '3 yıl', product: 'Fiber 500 internet' },
    crm: [
      'Aralıklı kopmalar için 9 günde üçüncü başvuru',
      '28 Eylül ve 2 Ekim teknisyen ziyaretlerinin ikisi de “erişim yok” olarak kapatılmış',
      '2 Ekim çağrı notu: müşteri iki gün de bütün gün evde olduğunu söylüyor',
      'Kaçırılan randevu tazminatı (ziyaret başına 30 €) uygulanmamış',
    ],
    policy: [
      'Kaçırılan randevu: ziyaret başına 30 € otomatik iade. Uygulanmamışsa uygulayın',
      'Müşterinin ziyarete ilişkin anlatımına itiraz etmeyin; konuyu saha operasyonlarına iletin',
      'Öncelikli teknisyen randevuları (48 saat içinde, 30 dakika önce aranarak) takım lideri masası üzerinden alınır',
      'Yönetici isteyen müşterinin 2 saat içinde takım lideri tarafından aranma hakkı vardır',
    ],
    opening:
      'Hayır. Hepsini baştan anlatmayacağım. İki kez işten izin aldım, iki kez de kimse gelmedi. Bana bir yönetici bağlayın. Hemen.',
    steps: [
      {
        options: [
          {
            text: 'İki gün işten izin aldınız ve kimse gelmedi. Kızmakta sonuna kadar haklısınız, çok üzgünüm. Size yönetici ayarlayabilirim; hâlâ isterseniz ayarlayacağım da. Notlarınız önümde açık, hiçbir şeyi baştan anlatmanız gerekmeyecek. Önce çözmeyi denemem için bana iki dakika verir misiniz?',
            reply: '…İki dakika. Buyurun. Ama “çözeceğim” lafını iki kez duydum zaten.',
            note: 'Başına geleni adıyla söylüyor, yöneticiyi reddetmiyor ve istediği tek şeyi sunuyor: kendini tekrar etmemek.',
          },
          {
            text: 'Sinirlenmenizi anlıyorum. Sizi bir takım liderine aktarıyorum.',
            reply: '…Alo? Yine oradan oraya aktarıldım, değil mi? Yönetici siz misiniz? Değil mi? Aynı kişisiniz. Peki.',
            note: 'Öfkeli bir arayanı bilgi vermeden aktarmak genellikle onu kuyruğa düşürür. Takım lideri başka çağrıda; müşteri size daha öfkeli döndü.',
          },
          {
            text: 'Beyefendi, sakin olmazsanız size yardımcı olamam.',
            reply: 'Sakin mi olayım? İki günlük yevmiyem gitti! Bana sakin ol demeyin!',
            note: '“Sakin olun” bugüne kadar kimseyi sakinleştirmedi. Müşteriye sorunun kaçırılan ziyaretler değil, kendi öfkesi olduğunu söyler.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Elimdeki bilgi şöyle, yanlış olan varsa söyleyin: bağlantı dokuz gündür kopuyor, 28 Eylül ve 2 Ekim için teknisyen randevusu verilmiş, iki gün de evdeymişsiniz ve kimse kapıyı çalmamış. Doğru mu?',
            reply: 'Doğru. Nihayet biri okumuş. Bir önceki, sokağımın adını üç kez kodlattı.',
            note: 'Notlardan özetlemek, okuduğunuzu kanıtlar ve müşterinin bir yanlışı tek kelimeyle düzeltmesine olanak verir.',
          },
          {
            text: 'İlk arızanın ne olduğunu anlatabilir misiniz?',
            reply: 'Kopuyor! Notlarda yazıyor! Dokuz gün! 28’i ve 2’si için teknisyen ayarlandı, kimse gelmedi!',
            note: 'Baştan anlatmayacağını söylemişti ve her şey ekranınızda. Sormadan önce okuyun.',
          },
          {
            text: 'Devam etmeden önce sizi yeniden güvenlik doğrulamasından geçirmem, sonra modemde bazı kontroller yapmam gerekiyor.',
            reply: 'Sorun modem değil, sorun teknisyenin gelmemesi! 28’i ve 2’si için randevu verildi. Kimse gelmedi!',
            note: 'Üçüncü başvuruda senaryoyu baştan başlatmak, önceki aramalarının hiçbir değeri olmadığını gösterir.',
          },
        ],
      },
      {
        prompt: 'Her iki teknisyen işi de “erişim yok, müşteri evde değil” notuyla kapatılmış.',
        options: [
          {
            text: 'Size açık olacağım: iki ziyaret de bizim tarafta “erişim yok” olarak kapatılmış. Ben orada değildim, siz oradaydınız; üstelik evde olmak için izin almışsınız. Bunu sizinle tartışmayacağım. İkisini de saha ekibimize bildiriyorum, gerçekte ne olduğunu incelesinler.',
            reply: 'Erişim yok mu? Ön odada oturuyordum! …Peki. En azından söylediniz. Şimdi ne olacak?',
            note: 'Kaydın ne dediğini, kaydın tarafını tutmadan söylüyor. Müşteri aynı anda hem gerçeği hem bir müttefik kazanıyor.',
          },
          {
            text: 'Ziyaretlerin gerçekleşmediğini görüyorum. Yeni bir randevu almaya odaklanalım.',
            reply: 'Gerçekleşmedi. Öyle de denebilir. Şimdi ne olacak?',
            note: 'Tartışmadan kaçınıyor ama notların ne dediğini gizliyor. “Erişim yok” ifadesini sonra başkasından duyarsa güven biter.',
          },
          {
            text: 'Teknisyen iki seferde de evde kimsenin olmadığını kaydetmiş; yani teknik olarak bunlar bizim kaçırdığımız randevular değil.',
            reply: 'Bana yalancı mı diyorsunuz? İki gün de ön odamdaydım!',
            note: 'Üçüncü kez arayan bir müşteriye karşı iki kelimelik iş notunun tarafını tuttunuz; oysa politika itiraz etmeyin diyor.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Üç şey yapıyorum, hemen şimdi. Bir: 60 euro iade, kaçırılan her ziyaret için 30 euro; bu zaten otomatik yapılmalıydı. İki: takım liderimin masasından 48 saat içinde öncelikli randevu alıyorum; teknisyen gelmeden 30 dakika önce sizi arayacak, hiçbir şüphe kalmayacak. Üç: işin üzerinde benim adım var. Randevuyu teyit ederken bir dakika bekleyebilir misiniz?',
            reply: '…Perşembe sabahı, önce telefon edecekler. Peki. Aldığım ilk düzgün yanıt bu. Yine de bir yöneticinin bundan haberi olsun istiyorum.',
            note: 'Hak edilen iadeyi istenmeden uyguluyor, öncelikli yolu kullanıyor ve bekletmeyi açıklıyor. Gerilimi düşüren şey sahiplenmektir.',
          },
          {
            text: 'En yakın teknisyen randevusu pazartesi, 8 ile 18 arasında. Oluşturayım mı?',
            reply: 'Pazartesi. Beş gün daha, yine bütün gün. Oluşturun. Yine de bir yöneticinin bundan haberi olsun istiyorum.',
            note: 'Tam da bu durum için öncelikli randevular varken üçüncü aksaklık için standart randevu. Ayrıca 60 euroluk tazminatı ödemediniz.',
          },
          {
            text: 'Yarın sabah ilk iş olarak bir teknisyenin yanınızda olmasını sağlayacağım, garanti.',
            reply: 'Garanti mi? Bu sözünüzü unutmayacağım. Yine de bir yöneticinin bundan haberi olsun istiyorum.',
            note: 'Almadığınız bir randevuyu garanti edemezsiniz. Bu hesapta tutulmayan üçüncü söz, düzenleyici kuruma şikâyet demektir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Olacak. Takım liderimden sizi iki saat içinde aramasını istiyorum; konuştuğumuz her şey notlarda olacak, hiçbirini tekrarlamayacaksınız. Referans numaranız HC-58214, üzerinde benim adım var. Perşembe sabahı, 30 dakika önce arama, bir sonraki faturanızda 60 euro iade. Atladığım bir şey var mı?',
            reply: 'Yok. Bu kadar. Bakın, sizin suçunuz olmadığını biliyorum. Teşekkürler.',
            note: 'Sorun çözülmüş olsa da yönetici talebini yerine getiriyor. Söz verilmiş, saati belli bir geri arama gerçek bir üst seviyeye aktarımdır.',
          },
          {
            text: 'Bir yöneticinin dosyayı incelemesi için not düşebilirim. Randevunuz da iadeniz de var, yani her şey tamam olmalı.',
            reply: 'Not. Peki. Perşembe günü görürüz o zaman.',
            note: 'Not, geri arama değildir. İki kez istedi ve iki saat içinde aranmaya hakkı var.',
          },
          {
            text: 'Artık yöneticiye gerek yok, o da size benim söylediklerimin aynısını söyler.',
            reply: 'Buna siz karar veremezsiniz. Bunu yazılı olarak bildireceğim.',
            note: 'Üst seviyeye aktarımı reddetmek politika ihlalidir ve toparlanmış bir çağrıyı resmî şikâyete çevirir.',
          },
        ],
      },
    ],
    dispositions: [
      'Şikâyet: takım liderine aktarıldı',
      'Teknik: arıza, teknisyen randevusu verildi',
      'Teknik: çağrıda çözüldü',
      'Genel bilgi talebi',
    ],
    takeaway: 'Tekrar arayan öfkeli müşteri, bu çağrının farklı olduğuna dair kanıt ister. Notları sesli okuyun, çözümü sahiplenin ve yönetici talebini asla reddetmeyin.',
  },

  'double-direct-debit': {
    title: 'Ödeme iki kez çekilmiş',
    customer: { name: 'Hye-jin Park', tenure: '1 yıl', product: 'Mobil 50GB ve Fiber 100' },
    crm: [
      '1 Ekim’de 67,20 €’luk iki otomatik ödeme tahsil edilmiş',
      'Bilinen sorun KI-2291: faturalama sistemi geçişi sırasında mükerrer tahsilat',
      'Mükerrer ödeme için iade talebi henüz açılmamış',
    ],
    policy: [
      'İadeler müşterinin bankasına 3–5 iş gününde ulaşır. Temsilciler bunu hızlandıramaz',
      'Müşteriler Otomatik Ödeme Güvencesi kapsamında kendi bankalarından anında iade isteyebilir',
      'Hatamızdan kaynaklanan banka masrafları, hesap ekstresi görülerek karşılanır',
      'İade referans numarasını içeren onay SMS’i gönderin',
    ],
    opening:
      'Ödememi iki kez çekmişsiniz. Altmış yedi yirmi, iki kere, aynı gün. Cuma günü kiram çekilecek ve hesapta artık yeterli para yok.',
    steps: [
      {
        options: [
          {
            text: 'Bu olmamalıydı; cuma günü kiranız olduğu için acil olduğunu da anlıyorum. Hemen hesaba bakayım. Adınızı, soyadınızı ve doğum tarihinizi alabilir miyim?',
            reply: 'Hye-jin Park, 9 Haziran 1994.',
            note: 'Müşterinin dile getirdiği sonucu kabul ediyor, sonra doğrulama yapıyor.',
          },
          {
            text: 'Adınızı, soyadınızı ve doğum tarihinizi alabilir miyim lütfen?',
            reply: 'Hye-jin Park, 9 Haziran 1994. Görebiliyor musunuz?',
            note: 'Doğru ama soğuk. Size kirasının tehlikede olduğunu söyledi.',
          },
          {
            text: 'İkisinin de bizden olduğuna emin misiniz? Bankalar bazen bekleyen bir ödemeyi iki kez gösterir.',
            reply: 'Bankacılık uygulamama bakıyorum. İki ödeme, ikisi de Halden, ikisi de çekilmiş. Hye-jin Park, 9 Haziran 1994.',
            note: 'Müşteriyi sorgulamadan önce hesaba bakın. Mükerrer ödeme ekranınızda duruyor.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Teşekkür ederim. İki ödemeyi de görüyorum; ikincisi bizim hatamız: ayın 1’inde bazı ödemelerin iki kez tahsil edilmesine yol açan bir faturalama arızası yaşadık. Çok üzgünüm. Bize fazladan hiçbir borcunuz yok.',
            reply: 'Peki. En azından görebiliyorsunuz. Paramı ne zaman geri alacağım?',
            note: 'Olguları doğruluyor, sorumluluğu yalın sözcüklerle üstleniyor ve bakiye konusunda müşteriyi rahatlatıyor.',
          },
          {
            text: 'Evet, iki ödeme görüyorum. Bir sistem hatası gibi görünüyor.',
            reply: 'Sistem hatası. Peki. Paramı ne zaman geri alacağım?',
            note: 'Doğru, ama “sistem hatası” kimse sorumlu değilmiş gibi duyulur. “Bizim hatamız” deyin.',
          },
          {
            text: 'Görünüşe göre bankanız talebimizi iki kez işlemiş. Konuyu onlarla görüşmeniz gerekebilir.',
            reply: 'Bankam sizden kaynaklandığını söylüyor. Kendi sitenizde bununla ilgili duyuru var! Paramı ne zaman geri alacağım?',
            note: 'Bilinen bir iç arıza için üçüncü tarafı suçlamak. Sorun kayıtlı; yanıt vermeden önce bilinen sorunlara bakın.',
          },
        ],
      },
      {
        options: [
          {
            text: 'İade talebini şimdi açtım. Dürüst olmam gerek: paranın hesabınıza ulaşması 3 ila 5 iş günü sürüyor ve bunu buradan hızlandıramam. Cuma yüzünden daha hızlı bir yol var: Otomatik Ödeme Güvencesi kapsamında bankanızı ararsanız iadeyi hemen, çoğu zaman aynı gün yapabilirler.',
            reply: 'Bunu yapabileceğimi bilmiyordum. Sizden sonra onları arayacağım. Söylediğiniz için teşekkürler. Bir şey daha var ama: ikinci ödeme hesabımı eksiye düşürdüğü için bankam 25 euro masraf kesti.',
            note: 'Dürüst süre ve daha hızlı yol bir arada. Güvenceyi anlatmak, şirketin rahatına değil müşteriye hizmet eder.',
          },
          {
            text: 'İade talebini açtım. 3 ila 5 iş günü içinde hesabınıza geçecek.',
            reply: 'Beş gün mü? Kira cuma günü! …Üstelik bankam bu yüzden eksiye düştüm diye 25 euro masraf kesti.',
            note: 'Doğru, ama müşterinin son günü cuma ve aynı gün sonuç veren bir yol olduğunu biliyordunuz.',
          },
          {
            text: 'Acil olarak işaretledim, yarına kadar hesabınıza geçmiş olur.',
            reply: 'Yarın, güzel. Buna güveniyorum. Ayrıca bankam bu yüzden eksiye düştüm diye 25 euro masraf kesti.',
            note: 'Acil işareti diye bir şey yok. Müşteri kirasını sizin uydurduğunuz bir tarihe göre planlayacak.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Onu biz karşılayacağız, doğrudan bizim hatamızın sonucu. 25 euroyu gösteren ekstre satırının fotoğrafını, birazdan göndereceğim SMS’teki adrese iletin; 48 saat içinde Halden hesabınıza iade edilecek.',
            reply: 'Tamam, bu akşam yaparım. Bu adil.',
            note: 'Politikayı biliyor, hemen evet diyor ve belge adımını kolaylaştırıyor.',
          },
          {
            text: 'Bunu ayrı bir şikâyet olarak açmanız gerekir, ama talep edebilirsiniz.',
            reply: 'Bir arama daha mı? Peki. Nasıl yapacağımı söyleyin.',
            note: 'Masrafların karşılanması standart politikadır, şikâyet gerekmez. İkinci bir temas yarattınız.',
          },
          {
            text: 'Maalesef banka masrafları sizinle bankanız arasındadır. Biz yalnızca çektiğimiz tutarı iade edebiliriz.',
            reply: 'Buna siz sebep oldunuz! Bu kabul edilemez.',
            note: 'Yanlış. Hatamızdan kaynaklanan masraflar belge karşılığında ödenir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Özetle: 67,20 euroluk iade bugün açıldı, referans RF-30917, 3 ila 5 iş gününde ya da bankanız üzerinden daha erken ulaşacak. 25 euro için ekstre fotoğrafını gönderin. Bir sonraki otomatik ödemeniz normal tutarda ve tek sefer çekilecek. Hepsini SMS ile gönderdim. Yapabileceğim başka bir şey var mı?',
            reply: 'Hayır, hepsi bu. Hallettiğiniz için teşekkürler.',
            note: 'Referans numarası, tarihler, iki yol ve gelecek ay için güvence; üstelik yazılı onayla.',
          },
          {
            text: 'Hepsi açıldı. Size bir SMS gelecek. Başka bir şey var mı?',
            reply: 'Hayır. Teşekkürler.',
            note: 'Kabul edilebilir. Referans numarasını sesli söylemek, SMS gelmezse bir aramayı önler.',
          },
          {
            text: 'Tamam, yapıldı. Hoşça kalın.',
            reply: 'Bir dakika, bir referans numarası var mı ya da… alo?',
            note: 'Referans yok, özet yok. İade gecikirse müşterinin gösterebileceği hiçbir şey yok.',
          },
        ],
      },
    ],
    dispositions: [
      'Fatura: mükerrer ödeme, iade talebi açıldı',
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Tahsilat: ödeme planı yapıldı',
      'Şikâyet: takım liderine aktarıldı',
    ],
    takeaway: 'Hata bizdeyse bunu söyleyin, gerçek süreyi verin ve bizim yolumuz olmasa bile daha hızlı bir yol varsa müşteriye anlatın.',
  },

  'payment-difficulty': {
    title: 'Müşteri gecikmiş faturasını ödeyemiyor',
    customer: { name: 'Tomasz Wiśniewski', tenure: '4 yıl', product: 'Mobil Sınırsız, aylık 38 €' },
    crm: [
      'Gecikmiş bakiye 146,80 € (iki fatura ve 10 € gecikme ücreti)',
      'Hizmet kısıtlaması 9 Ekim için planlanmış',
      'Ağustos’tan önce hiç geciken ödeme yok',
      'Cihaz taksitinde 2 yıl kaldı; Sınırsız tarifenin kendisi taahhüt dışı',
    ],
    policy: [
      'Ödeme planları: müşterinin ödeyebileceğini söylediği tutara göre, en fazla 6 ay',
      'Plan yapılınca kısıtlama durdurulur. Plan kurulduğunda gecikme ücretleri silinir',
      'Taahhüt dışı tarifeler cezasız olarak Temel tarifeye (aylık 15 €) geçirilebilir',
      'Müşterinin durumuna ilişkin destek notu için müşterinin onayı gerekir',
      'Ücretsiz ve bağımsız borç danışmanlığı bilgisini verin. Hattın kesilmesini asla baskı aracı olarak kullanmayın',
    ],
    opening:
      'Merhaba. Ben, şey… Ayın dokuzunda telefonumu keseceğinizi söyleyen bir mektup aldım. Hepsini ödeyemem. Ne diyeceğimi pek bilmiyorum.',
    steps: [
      {
        options: [
          {
            text: 'Aradığınıza sevindim. Yapılacak en doğru şey buydu; böylece ayın dokuzundan önce bir çözüm bulabiliriz. Bugün hiçbir şey kesilmiyor. Adınızı, soyadınızı ve doğum tarihinizi alabilir miyim? Sonra birlikte bakalım.',
            reply: 'Tomasz Wiśniewski, 21 Şubat 1988. Teşekkür ederim. Bana sadece “ödeyin” diyeceğinizi sanmıştım.',
            note: 'Borç için aramak cesaret ister. Teşekkür etmek ve yakın tehdidi ortadan kaldırmak, müşterinin açık konuşmasını sağlar.',
          },
          {
            text: 'Bu konuda yardımcı olabilirim. Adınızı, soyadınızı ve doğum tarihinizi alabilir miyim?',
            reply: 'Tomasz Wiśniewski, 21 Şubat 1988.',
            note: 'Nötr. Müşteri mahcup ve bir talep bekliyor; tek cümlelik bir güvence bütün çağrıyı değiştirir.',
          },
          {
            text: 'Bakiyeniz 146,80 euro ve kısıtlama olmaması için ayın dokuzuna kadar ödenmesi gerekiyor. Bugün nasıl ödemek istersiniz?',
            reply: 'Hepsini ödeyemeyeceğimi az önce söyledim. …Tomasz Wiśniewski, 21 Şubat 1988.',
            note: 'Söze tamamını ödeyemeyeceğini söyleyerek başladı. Yine de tamamını istemek, konuşmayı başlamadan bitirir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Teşekkürler Tomasz Bey. Ağustos’tan önce hiç ödeme kaçırmamışsınız, demek ki bir şey değişmiş. Ayrıntı vermek zorunda değilsiniz, ama paylaşmakta sakınca görmediğiniz her şey doğru seçeneği bulmama yardımcı olur.',
            reply: 'Ağustos’ta işimi kaybettim. Depo kapandı. Ajans üzerinden birkaç vardiya alıyorum ama düzensiz. Ayda belki yirmi beş ödeyebilirim. Telefon bana ajans için lazım, vardiyalar için arıyorlar.',
            note: 'Ödeme geçmişini fark ediyor, kurcalamadan davet ediyor ve önemli iki şeyi öğreniyor: ödeme gücü ve telefonun neden vazgeçilmez olduğu.',
          },
          {
            text: 'Bugün ne kadar ödeyebilirsiniz?',
            reply: 'Bugün… belki yirmi beş. Ağustos’ta işimi kaybettim. Telefon bana lazım, ajans vardiyalar için arıyor.',
            note: 'Bir rakam alıyor, ama müşterinin sürdürebileceği tutarı değil bugünü soruyor.',
          },
          {
            text: 'Aylık gelirinizi ve kira, gıda ve diğer borçlara ne kadar harcadığınızı söyler misiniz?',
            reply: 'Bu… çok fazla soru. Ağustos’ta işimi kaybettim. Ayda yirmi beş ödeyebilirim belki. Telefon bana iş için lazım.',
            note: 'Tam bir gelir-gider incelemesi uzman ekibin işidir. Ön hat temsilcisinden gelince sorguya çekilmek gibi hissettirir.',
          },
        ],
      },
      {
        options: [
          {
            text: 'O hâlde planı yirmi beşe göre kuralım. 10 euroluk gecikme ücretlerini siliyorum, geriye 136,80 euro kalıyor. Altı aya bölünce ayda 22,80 euro ediyor. Tarifeniz taahhüt dışı olduğu için sizi 38 yerine 15 euroluk Temel tarifeye de geçirebilirim; ajans için sınırsız arama onda da var. İkisi birlikte ayda 38 euronun altında kalıyor ve plan kurulur kurulmaz kısıtlama iptal ediliyor.',
            reply: 'Yani… şimdi ödediğimden az ve telefon bende mi kalıyor? Evet. Evet, lütfen öyle yapın.',
            note: 'Müşterinin rakamından başlıyor, ücretleri siliyor, planın gerçekten sürdürülebilmesi için süregelen maliyeti düşürüyor ve gelir elde etmesi için gereken hizmeti koruyor.',
          },
          {
            text: 'Bakiye kapanana kadar normal faturanıza ek olarak ayda 25 euroluk bir plan kurabilirim.',
            reply: 'Hepsi birlikte ayda altmış üç ediyor. Deneyeceğim. Sürdürebileceğimden emin değilim.',
            note: 'Karşılayamayabileceğini söylediği bir plan bir iki ay içinde bozulur. Planı sürdürülebilir kılan şey tarife değişikliğidir.',
          },
          {
            text: 'Kabul edebileceğimiz en düşük tutar yarısı şimdi, yani 73,40 euro, kalanı da gelecek ay.',
            reply: 'Yetmiş üç eurom yok. Zaten bu yüzden arıyorum.',
            note: 'Böyle bir alt sınır yok. Planlar müşterinin ödeyebileceği tutara göre yapılır.',
          },
        ],
      },
      {
        prompt: 'Bir destek notu, her aramada durumunu baştan anlatmasını önler. Bunun için onayı gerekir.',
        options: [
          {
            text: 'Bir şey daha var, karar sizin. Hesabınıza iş değiştirme döneminde olduğunuzu ve ödeme planınız bulunduğunu belirten kısa bir not ekleyebilirim; böylece tekrar aradığınızda kimse açıklama istemez. Notu yalnızca destek ekibimiz görür. Eklememi ister misiniz?',
            reply: 'Evet, iyi olur. Her seferinde baştan anlatmak istemiyorum.',
            note: 'Neyin, neden kaydedileceğini ve kimin göreceğini açıklıyor, sonra soruyor. Geçerli onay budur.',
          },
          {
            text: 'Durumunuzla ilgili hesabınıza bir not düşeceğim.',
            reply: 'Ha. Peki. Onu kim görüyor?',
            note: 'İyi niyetli, ama iş kaybı gibi durumlar hassastır. Önce sorun ve kimin görebileceğini söyleyin.',
          },
          {
            text: 'Sizi sistemde kırılgan müşteri olarak işaretledim.',
            reply: 'Kırılgan mı? Ben öyle değilim… Sadece işimi kaybettim. Bunu ben istemedim.',
            note: 'Onay alınmadan ve müşterinin küçültücü bulduğu bir etiketle kaydedildi. Kategoriyi değil, sunulan desteği anlatın.',
          },
        ],
      },
      {
        options: [
          {
            text: 'Özetle: 22,80 euroluk ilk plan ödemesi 1 Kasım’da, Temel tarife bir sonraki faturanızdan itibaren geçerli ve kısıtlama iptal edildi. Bir ay sıkışacak gibi olursanız ödeme tarihinden önce bizi arayın, planı ayarlarız. Ayrıca ücretsiz ve bağımsız bir borç danışmanlığı hizmetinin numarasını SMS ile göndereceğim. Pek çok kişi faydasını görüyor ve gizlidir. Vardiyalarda bol şans Tomasz Bey.',
            reply: 'Teşekkür ederim. Gerçekten. Bu aramadan çok çekiniyordum.',
            note: 'Tarihler, işler değişirse bir güvenlik payı ve yargılamadan sunulan borç danışmanlığı.',
          },
          {
            text: 'Hepsi kuruldu. Plan tarihlerini içeren bir SMS alacaksınız. Başka bir şey var mı?',
            reply: 'Hayır. Yardımınız için teşekkürler.',
            note: 'Sorun yok, ama politikanın her ödeme güçlüğü çağrısında sunmanızı istediği ücretsiz borç danışmanlığına yönlendirme yok.',
          },
          {
            text: 'Plan kuruldu. Yalnız ödemeyi kaçırmayın; çünkü plan iptal olur ve telefonu kesmek zorunda kalırız.',
            reply: '…Peki. Tamam.',
            note: 'Tehditle bitirmek çağrıyı boşa çıkarır. Müşteriye başına ne geleceğini değil, zorlanırsa ne yapması gerektiğini söyleyin.',
          },
        ],
      },
    ],
    dispositions: [
      'Tahsilat: ödeme planı yapıldı',
      'Fatura: itiraz, iyi niyet indirimi uygulandı',
      'Elde tutma: iptal işleme alındı',
      'Genel bilgi talebi',
    ],
    takeaway: 'Müşterinin sürdürebileceği bir plan, sürdüremeyeceği daha büyük bir plandan değerlidir. Onun rakamından başlayın, süregelen maliyeti düşürün ve tekrar aramayı güvenli kılın.',
  },
}
