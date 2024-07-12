import { NO, YES } from "../config/apiStatuses.js";

const bloodGroups = [
  { blood_group: "A+" },
  { blood_group: "A-" },
  { blood_group: "B+" },
  { blood_group: "B-" },
  { blood_group: "AB+" },
  { blood_group: "AB-" },
  { blood_group: "O+" },
  { blood_group: "O-" },
];

const motorcycleNames = [
  { motorcycle_model_name: "Aprilia RS 457" },
  { motorcycle_model_name: "Aprilia RS 660" },
  { motorcycle_model_name: "Aprilia RSV4" },
  { motorcycle_model_name: "Aprilia SR 125" },
  { motorcycle_model_name: "Aprilia SR 160" },
  { motorcycle_model_name: "Aprilia SR Storm" },
  { motorcycle_model_name: "Aprilia SXR 125" },
  { motorcycle_model_name: "Aprilia SXR 160" },
  { motorcycle_model_name: "Aprilia Tuono 660" },
  { motorcycle_model_name: "Aprilia Tuono V4" },
  { motorcycle_model_name: "Ather 450x" },
  { motorcycle_model_name: "Ather Rizta" },
  { motorcycle_model_name: "Atumobile Atum V1" },
  { motorcycle_model_name: "Atumobile AtumVader" },
  { motorcycle_model_name: "Bajaj Avenger 220 Street" },
  { motorcycle_model_name: "Bajaj Avenger Cruise 220" },
  { motorcycle_model_name: "Bajaj Avenger Street 160" },
  { motorcycle_model_name: "Bajaj Chetak" },
  { motorcycle_model_name: "Bajaj Chetak Premium" },
  { motorcycle_model_name: "Bajaj CT 100" },
  { motorcycle_model_name: "Bajaj CT 110X" },
  { motorcycle_model_name: "Bajaj CT 125X" },
  { motorcycle_model_name: "Bajaj Discover" },
  { motorcycle_model_name: "Bajaj Dominar 250" },
  { motorcycle_model_name: "Bajaj Dominar 400" },
  { motorcycle_model_name: "Bajaj Platina 100" },
  { motorcycle_model_name: "Bajaj Platina 110" },
  { motorcycle_model_name: "Bajaj Pulsar 125" },
  { motorcycle_model_name: "Bajaj Pulsar 150" },
  { motorcycle_model_name: "Bajaj Pulsar 180 DTS-i" },
  { motorcycle_model_name: "Bajaj Pulsar 220F" },
  { motorcycle_model_name: "Bajaj Pulsar AS200" },
  { motorcycle_model_name: "Bajaj Pulsar F250" },
  { motorcycle_model_name: "Bajaj Pulsar N150" },
  { motorcycle_model_name: "Bajaj Pulsar N160" },
  { motorcycle_model_name: "Bajaj Pulsar N250" },
  { motorcycle_model_name: "Bajaj Pulsar NS 125" },
  { motorcycle_model_name: "Bajaj Pulsar NS160" },
  { motorcycle_model_name: "Bajaj Pulsar NS200" },
  { motorcycle_model_name: "Bajaj Pulsar P150" },
  { motorcycle_model_name: "Bajaj Pulsar RS200" },
  { motorcycle_model_name: "Bajaj V15" },
  { motorcycle_model_name: "Benelli 302 R" },
  { motorcycle_model_name: "Benelli 302 S" },
  { motorcycle_model_name: "Benelli 502 C" },
  { motorcycle_model_name: "Benelli Imperiale 400" },
  { motorcycle_model_name: "Benelli Leoncino 500" },
  { motorcycle_model_name: "Benelli TRK 251" },
  { motorcycle_model_name: "Benelli TRK 502" },
  { motorcycle_model_name: "Benelli TRK 502 X" },
  { motorcycle_model_name: "BMW C 400 GT" },
  { motorcycle_model_name: "BMW F 850 GS" },
  { motorcycle_model_name: "BMW F 850 GS Adventure" },
  { motorcycle_model_name: "BMW F 900 R" },
  { motorcycle_model_name: "BMW F 900 R Pro" },
  { motorcycle_model_name: "BMW F 900 XR" },
  { motorcycle_model_name: "BMW G 310 GS" },
  { motorcycle_model_name: "BMW G 310 R" },
  { motorcycle_model_name: "BMW G 310 RR" },
  { motorcycle_model_name: "BMW K 1600 Bagger" },
  { motorcycle_model_name: "BMW K 1600 Grand America" },
  { motorcycle_model_name: "BMW K 1600 GTL" },
  { motorcycle_model_name: "BMW M 1000 RR" },
  { motorcycle_model_name: "BMW M 1000 RR Competition" },
  { motorcycle_model_name: "BMW R 1250 GS" },
  { motorcycle_model_name: "BMW R 1250 GS Adventure" },
  { motorcycle_model_name: "BMW R 1250 R" },
  { motorcycle_model_name: "BMW R 1250 RT" },
  { motorcycle_model_name: "BMW R 1300 GS" },
  { motorcycle_model_name: "BMW R 18" },
  { motorcycle_model_name: "BMW R 18 100 Year Edition" },
  { motorcycle_model_name: "BMW R 18 Classic First Edition" },
  { motorcycle_model_name: "BMW R 18 Transcontinental" },
  { motorcycle_model_name: "BMW R nine T" },
  { motorcycle_model_name: "BMW R nineT 100 Year Edition" },
  { motorcycle_model_name: "BMW R nineT Scrambler" },
  { motorcycle_model_name: "BMW S 1000 R" },
  { motorcycle_model_name: "BMW S 1000 R M Sport" },
  { motorcycle_model_name: "BMW S 1000 R Pro" },
  { motorcycle_model_name: "BMW S 1000 RR" },
  { motorcycle_model_name: "BMW S 1000 RR M Sport" },
  { motorcycle_model_name: "BMW S 1000 RR Pro" },
  { motorcycle_model_name: "BMW S 1000 XR" },
  { motorcycle_model_name: "BSA Electric" },
  { motorcycle_model_name: "BSA Gold Star" },
  { motorcycle_model_name: "CFMoto 300 NK" },
  { motorcycle_model_name: "CFMoto 650 GT" },
  { motorcycle_model_name: "CFMoto 650 MT" },
  { motorcycle_model_name: "CFMoto 650 NK" },
  { motorcycle_model_name: "Ducati Desert X" },
  { motorcycle_model_name: "Ducati Desmosedici" },
  { motorcycle_model_name: "Ducati Diavel 1260" },
  { motorcycle_model_name: "Ducati Diavel 1260 S" },
  { motorcycle_model_name: "Ducati Diavel V4" },
  { motorcycle_model_name: "Ducati Hypermotard 950" },
  { motorcycle_model_name: "Ducati Hypermotard 950 SP" },
  { motorcycle_model_name: "Ducati Monster" },
  { motorcycle_model_name: "Ducati Monster SP" },
  { motorcycle_model_name: "Ducati Multistrada 950" },
  { motorcycle_model_name: "Ducati Multistrada V2" },
  { motorcycle_model_name: "Ducati Multistrada V2 S" },
  { motorcycle_model_name: "Ducati Multistrada V4" },
  { motorcycle_model_name: "Ducati Multistrada V4 Pikes Peak" },
  { motorcycle_model_name: "Ducati Multistrada V4 Rally" },
  { motorcycle_model_name: "Ducati Multistrada V4 S" },
  { motorcycle_model_name: "Ducati Panigale V2" },
  { motorcycle_model_name: "Ducati Panigale V2 Bayliss" },
  { motorcycle_model_name: "Ducati Panigale V4" },
  { motorcycle_model_name: "Ducati Panigale V4 R" },
  { motorcycle_model_name: "Ducati Panigale V4 S" },
  { motorcycle_model_name: "Ducati Scrambler 1100" },
  { motorcycle_model_name: "Ducati Scrambler 1100 Sport Pro" },
  { motorcycle_model_name: "Ducati Scrambler 1100 Tribute Pro" },
  { motorcycle_model_name: "Ducati Scrambler 800" },
  { motorcycle_model_name: "Ducati Scrambler 800 Full Throttle 2023" },
  { motorcycle_model_name: "Ducati Scrambler 800 Nightshift 2023" },
  { motorcycle_model_name: "Ducati Scrambler Desert Sled" },
  { motorcycle_model_name: "Ducati Streetfighter V2" },
  { motorcycle_model_name: "Ducati Streetfighter V4" },
  { motorcycle_model_name: "Ducati Streetfighter V4 Lamborghini" },
  { motorcycle_model_name: "Ducati Streetfighter V4 S" },
  { motorcycle_model_name: "Ducati Streetfighter V4 SP2" },
  { motorcycle_model_name: "Ducati SuperSport 950" },
  { motorcycle_model_name: "Ducati SuperSport 950 S" },
  { motorcycle_model_name: "Ducati xDiavel" },
  { motorcycle_model_name: "Ducati xDiavel Black Star" },
  { motorcycle_model_name: "Harley Davidson Fat Bob" },
  { motorcycle_model_name: "Harley Davidson Fat Boy 114" },
  { motorcycle_model_name: "Harley Davidson Heritage Classic" },
  { motorcycle_model_name: "Harley Davidson Nightster" },
  { motorcycle_model_name: "Harley Davidson Nightster 440" },
  { motorcycle_model_name: "Harley Davidson Nightster Special" },
  { motorcycle_model_name: "Harley Davidson Pan America 1250" },
  { motorcycle_model_name: "Harley Davidson Pan America 1250 Special" },
  { motorcycle_model_name: "Harley Davidson Road Glide Special" },
  { motorcycle_model_name: "Harley Davidson Sportster 500" },
  { motorcycle_model_name: "Harley Davidson Sportster S" },
  { motorcycle_model_name: "Harley Davidson Street Glide Special" },
  { motorcycle_model_name: "Harley Davidson Super Glide Custom" },
  { motorcycle_model_name: "Harley Davidson X440" },
  { motorcycle_model_name: "Hero Destini 125" },
  { motorcycle_model_name: "Hero Glamour" },
  { motorcycle_model_name: "Hero Glamour XTEC" },
  { motorcycle_model_name: "Hero HF 100" },
  { motorcycle_model_name: "Hero HF Deluxe" },
  { motorcycle_model_name: "Hero Honda CBZ Xtreme" },
  { motorcycle_model_name: "Hero Honda Hunk" },
  { motorcycle_model_name: "Hero Honda Karizma R" },
  { motorcycle_model_name: "Hero Impulse" },
  { motorcycle_model_name: "Hero Karizma XMR" },
  { motorcycle_model_name: "Hero Maestro Edge 110" },
  { motorcycle_model_name: "Hero Maestro Edge 125" },
  { motorcycle_model_name: "Hero Mavrick 440" },
  { motorcycle_model_name: "Hero Passion Plus" },
  { motorcycle_model_name: "Hero Passion XTEC" },
  { motorcycle_model_name: "Hero Pleasure Plus" },
  { motorcycle_model_name: "Hero Splendor Plus" },
  { motorcycle_model_name: "Hero Splendor Plus XTEC" },
  { motorcycle_model_name: "Hero Super Splendor" },
  { motorcycle_model_name: "Hero Super Splendor XTEC" },
  { motorcycle_model_name: "Hero Xoom 110" },
  { motorcycle_model_name: "Hero Xpulse 200 2V" },
  { motorcycle_model_name: "Hero XPulse 200 4V" },
  { motorcycle_model_name: "Hero XPulse 200 4V PRO" },
  { motorcycle_model_name: "Hero Xpulse 200T 2V" },
  { motorcycle_model_name: "Hero Xpulse 200T 4V" },
  { motorcycle_model_name: "Hero Xtreme 125R" },
  { motorcycle_model_name: "Hero Xtreme 160R" },
  { motorcycle_model_name: "Hero Xtreme 160R 4V" },
  { motorcycle_model_name: "Hero Xtreme 200S 4V" },
  { motorcycle_model_name: "Honda Activa" },
  { motorcycle_model_name: "Honda Activa 125" },
  { motorcycle_model_name: "Honda Activa 5G" },
  { motorcycle_model_name: "Honda Activa 6G" },
  { motorcycle_model_name: "Honda Aviator" },
  { motorcycle_model_name: "Honda CB Dazzler" },
  { motorcycle_model_name: "Honda CB200X" },
  { motorcycle_model_name: "Honda CB300F" },
  { motorcycle_model_name: "Honda CB300R" },
  { motorcycle_model_name: "Honda CB350" },
  { motorcycle_model_name: "Honda CB350RS" },
  { motorcycle_model_name: "Honda CB500X" },
  { motorcycle_model_name: "Honda CB650R" },
  { motorcycle_model_name: "Honda CBR 150" },
  { motorcycle_model_name: "Honda CBR1000RR-R" },
  { motorcycle_model_name: "Honda CBR250R" },
  { motorcycle_model_name: "Honda CBR650R" },
  { motorcycle_model_name: "Honda CD 110 Dream" },
  { motorcycle_model_name: "Honda CRF1100L Africa Twin" },
  { motorcycle_model_name: "Honda CRF1100L Africa Twin DCT" },
  { motorcycle_model_name: "Honda Dio" },
  { motorcycle_model_name: "Honda Dio 125" },
  { motorcycle_model_name: "Honda Gold Wing" },
  { motorcycle_model_name: "Honda Grazia" },
  { motorcycle_model_name: "Honda Hness CB350" },
  { motorcycle_model_name: "Honda Hness CB350 Legacy Edition" },
  { motorcycle_model_name: "Honda Hornet 160R" },
  { motorcycle_model_name: "Honda Hornet 2.0" },
  { motorcycle_model_name: "Honda Livo" },
  { motorcycle_model_name: "Honda NX500" },
  { motorcycle_model_name: "Honda Shine" },
  { motorcycle_model_name: "Honda Shine 100" },
  { motorcycle_model_name: "Honda SP 125" },
  { motorcycle_model_name: "Honda SP160" },
  { motorcycle_model_name: "Honda Unicorn" },
  { motorcycle_model_name: "Honda XBlade" },
  { motorcycle_model_name: "Honda XL750 Transalp" },
  { motorcycle_model_name: "Husqvarna Svartpilen 250" },
  { motorcycle_model_name: "Husqvarna Svartpilen 401" },
  { motorcycle_model_name: "Husqvarna Vitpilen 250" },
  { motorcycle_model_name: "Hyosung GT 650" },
  { motorcycle_model_name: "Hyosung GT 650R" },
  { motorcycle_model_name: "Indian Challenger" },
  { motorcycle_model_name: "Indian Chief Bobber Dark Horse" },
  { motorcycle_model_name: "Indian Chief Classic" },
  { motorcycle_model_name: "Indian Chief Dark Horse" },
  { motorcycle_model_name: "Indian Chieftain Classic" },
  { motorcycle_model_name: "Indian Chieftain Dark Horse" },
  { motorcycle_model_name: "Indian Chieftain Elite" },
  { motorcycle_model_name: "Indian Chieftain Limited" },
  { motorcycle_model_name: "Indian FTR" },
  { motorcycle_model_name: "Indian FTR R Carbon Fiber" },
  { motorcycle_model_name: "Indian Pursuit" },
  { motorcycle_model_name: "Indian Roadmaster" },
  { motorcycle_model_name: "Indian Scout" },
  { motorcycle_model_name: "Indian Scout Bobber" },
  { motorcycle_model_name: "Indian Scout Rogue" },
  { motorcycle_model_name: "Indian Springfield" },
  { motorcycle_model_name: "Indian Springfield Dark Horse" },
  { motorcycle_model_name: "Indian Super Chief Limited" },
  { motorcycle_model_name: "Jawa 350" },
  { motorcycle_model_name: "Jawa 42 Bobber" },
  { motorcycle_model_name: "Jawa 42 Standard" },
  { motorcycle_model_name: "Jawa Perak" },
  { motorcycle_model_name: "Jawa Standard" },
  { motorcycle_model_name: "Kawasaki Eliminator 450" },
  { motorcycle_model_name: "Kawasaki KLX 110" },
  { motorcycle_model_name: "Kawasaki KLX 140" },
  { motorcycle_model_name: "Kawasaki KLX 230RS" },
  { motorcycle_model_name: "Kawasaki KLX 450R" },
  { motorcycle_model_name: "Kawasaki KX 100" },
  { motorcycle_model_name: "Kawasaki KX 250" },
  { motorcycle_model_name: "Kawasaki KX 450" },
  { motorcycle_model_name: "Kawasaki KX112" },
  { motorcycle_model_name: "Kawasaki KX65" },
  { motorcycle_model_name: "Kawasaki Ninja 1000SX" },
  { motorcycle_model_name: "Kawasaki Ninja 300" },
  { motorcycle_model_name: "Kawasaki Ninja 400" },
  { motorcycle_model_name: "Kawasaki Ninja 500" },
  { motorcycle_model_name: "Kawasaki Ninja 650" },
  { motorcycle_model_name: "Kawasaki Ninja H2" },
  { motorcycle_model_name: "Kawasaki Ninja H2 Carbon" },
  { motorcycle_model_name: "Kawasaki Ninja H2 R" },
  { motorcycle_model_name: "Kawasaki Ninja ZX4R" },
  { motorcycle_model_name: "Kawasaki Versys 1000" },
  { motorcycle_model_name: "Kawasaki Versys 650" },
  { motorcycle_model_name: "Kawasaki Vulcan S" },
  { motorcycle_model_name: "Kawasaki W175" },
  { motorcycle_model_name: "Kawasaki W800 Street" },
  { motorcycle_model_name: "Kawasaki Z H2" },
  { motorcycle_model_name: "Kawasaki Z H2 SE" },
  { motorcycle_model_name: "Kawasaki Z650" },
  { motorcycle_model_name: "Kawasaki Z650RS" },
  { motorcycle_model_name: "Kawasaki Z650RS 50th Anniversary Edition" },
  { motorcycle_model_name: "Kawasaki Z800" },
  { motorcycle_model_name: "Kawasaki Z900" },
  { motorcycle_model_name: "Kawasaki Z900RS" },
  { motorcycle_model_name: "Kawasaki ZX-10R" },
  { motorcycle_model_name: "KTM 125 Duke" },
  { motorcycle_model_name: "KTM 200 Duke" },
  { motorcycle_model_name: "KTM 250 Adventure" },
  { motorcycle_model_name: "KTM 250 Duke" },
  { motorcycle_model_name: "KTM 390 Adventure" },
  { motorcycle_model_name: "KTM 390 Adventure with Spoke" },
  { motorcycle_model_name: "KTM 390 Adventure X" },
  { motorcycle_model_name: "KTM 390 Duke" },
  { motorcycle_model_name: "KTM 790 Adventure" },
  { motorcycle_model_name: "KTM RC 125" },
  { motorcycle_model_name: "KTM RC 200" },
  { motorcycle_model_name: "KTM RC 390" },
  { motorcycle_model_name: "LML Vespa" },
  { motorcycle_model_name: "Mahindra Mojo" },
  { motorcycle_model_name: "Moto Guzzi Moto Guzzi V85 TT" },
  { motorcycle_model_name: "Moto Morini Moto Morini Seiemmezzo" },
  { motorcycle_model_name: "Moto Morini Moto Morini X-Cape" },
  { motorcycle_model_name: "Ola S1 Air" },
  { motorcycle_model_name: "Ola S1 Pro" },
  { motorcycle_model_name: "Ola S1 Pro Gen 2" },
  { motorcycle_model_name: "Ola S1 X" },
  { motorcycle_model_name: "Ola S1 X 3kWh" },
  { motorcycle_model_name: "Orxa Mantis" },
  { motorcycle_model_name: "Others Others" },
  { motorcycle_model_name: "Revolt RV400" },
  { motorcycle_model_name: "Revolt RV400 Limited Edition" },
  { motorcycle_model_name: "Royal Enfield Bullet 350" },
  { motorcycle_model_name: "Royal Enfield Classic 350" },
  { motorcycle_model_name: "Royal Enfield Classic 500" },
  { motorcycle_model_name: "Royal Enfield Continental GT 650" },
  { motorcycle_model_name: "Royal Enfield Himalayan 411" },
  { motorcycle_model_name: "Royal Enfield Himalayan 450" },
  { motorcycle_model_name: "Royal Enfield Hunter 350" },
  { motorcycle_model_name: "Royal Enfield Interceptor 650" },
  { motorcycle_model_name: "Royal Enfield Meteor 350" },
  { motorcycle_model_name: "Royal Enfield Scram 411" },
  { motorcycle_model_name: "Royal Enfield Shotgun 650" },
  { motorcycle_model_name: "Royal Enfield Standard Bullet 500" },
  { motorcycle_model_name: "Royal Enfield Super Meteor 650" },
  { motorcycle_model_name: "Royal Enfield Thunderbird 350x" },
  { motorcycle_model_name: "Royal Enfield Thunderbird 500" },
  { motorcycle_model_name: "Suzuki Access 125" },
  { motorcycle_model_name: "Suzuki Avenis" },
  { motorcycle_model_name: "Suzuki Burgman Street" },
  { motorcycle_model_name: "Suzuki Burgman Street EX" },
  { motorcycle_model_name: "Suzuki Gixxer" },
  { motorcycle_model_name: "Suzuki Gixxer 250" },
  { motorcycle_model_name: "Suzuki Gixxer SF" },
  { motorcycle_model_name: "Suzuki Gixxer SF 250" },
  { motorcycle_model_name: "Suzuki GSX R1000R" },
  { motorcycle_model_name: "Suzuki GSX-S1000" },
  { motorcycle_model_name: "Suzuki Hayabusa" },
  { motorcycle_model_name: "Suzuki Intruder" },
  { motorcycle_model_name: "Suzuki Katana" },
  { motorcycle_model_name: "Suzuki V-Strom 650XT" },
  { motorcycle_model_name: "Suzuki V-Strom 800 DE" },
  { motorcycle_model_name: "Suzuki V-Strom SX" },
  { motorcycle_model_name: "Suzuki Zeus 125" },
  { motorcycle_model_name: "Triumph Bonneville Bobber" },
  { motorcycle_model_name: "Triumph Bonneville Speedmaster" },
  { motorcycle_model_name: "Triumph Bonneville T100" },
  { motorcycle_model_name: "Triumph Bonneville T120" },
  { motorcycle_model_name: "Triumph Rocket 3" },
  { motorcycle_model_name: "Triumph Rocket 3 GT" },
  { motorcycle_model_name: "Triumph Scrambler 400 X" },
  { motorcycle_model_name: "Triumph Scrambler 900" },
  { motorcycle_model_name: "Triumph Speed 400" },
  { motorcycle_model_name: "Triumph Speed Triple 1200" },
  { motorcycle_model_name: "Triumph Speed Twin" },
  { motorcycle_model_name: "Triumph Speed Twin 900" },
  { motorcycle_model_name: "Triumph Street Triple" },
  { motorcycle_model_name: "Triumph Tiger 1200" },
  { motorcycle_model_name: "Triumph Tiger 1200 GT Explorer" },
  { motorcycle_model_name: "Triumph Tiger 1200 Rally Explorer" },
  { motorcycle_model_name: "Triumph Tiger 1200 Rally Pro" },
  { motorcycle_model_name: "Triumph Tiger 800 XCA" },
  { motorcycle_model_name: "Triumph Tiger 800 XCX" },
  { motorcycle_model_name: "Triumph Tiger 800 XRX" },
  { motorcycle_model_name: "Triumph Tiger 850 Sport" },
  { motorcycle_model_name: "Triumph Tiger 900" },
  { motorcycle_model_name: "Triumph Tiger 900 Rally" },
  { motorcycle_model_name: "Triumph Tiger 900 Rally Pro" },
  { motorcycle_model_name: "Triumph Tiger Sport 660" },
  { motorcycle_model_name: "Triumph Trident 660" },
  { motorcycle_model_name: "TVS Apache 150" },
  { motorcycle_model_name: "TVS Apache RR 310" },
  { motorcycle_model_name: "TVS Apache RTR 160" },
  { motorcycle_model_name: "TVS Apache RTR 160 4V" },
  { motorcycle_model_name: "TVS Apache RTR 180" },
  { motorcycle_model_name: "TVS Apache RTR 200 4V" },
  { motorcycle_model_name: "TVS Apache RTR 310" },
  { motorcycle_model_name: "TVS Flame" },
  { motorcycle_model_name: "TVS iQube" },
  { motorcycle_model_name: "TVS Jupiter" },
  { motorcycle_model_name: "TVS Jupiter 125" },
  { motorcycle_model_name: "TVS Ntorq 125" },
  { motorcycle_model_name: "TVS Ntorq 125 Race XP" },
  { motorcycle_model_name: "TVS Radeon" },
  { motorcycle_model_name: "TVS Raider" },
  { motorcycle_model_name: "TVS Ronin" },
  { motorcycle_model_name: "TVS Ronin Special Edition" },
  { motorcycle_model_name: "TVS RTR 160 4V" },
  { motorcycle_model_name: "TVS Scooty Pep Plus" },
  { motorcycle_model_name: "TVS Scooty Zest" },
  { motorcycle_model_name: "TVS Sport" },
  { motorcycle_model_name: "TVS Star City Plus" },
  { motorcycle_model_name: "TVS X" },
  { motorcycle_model_name: "TVS XL 100" },
  { motorcycle_model_name: "Ultraviolette F77" },
  { motorcycle_model_name: "Ultraviolette F77 Recon" },
  { motorcycle_model_name: "Ultraviolette F77 Space Edition" },
  { motorcycle_model_name: "Yamaha Aerox 155" },
  { motorcycle_model_name: "Yamaha Fascino 125 FI Hybrid" },
  { motorcycle_model_name: "Yamaha FZ 16" },
  { motorcycle_model_name: "Yamaha FZ 25" },
  { motorcycle_model_name: "Yamaha FZ-FI V3" },
  { motorcycle_model_name: "Yamaha FZ-S V2" },
  { motorcycle_model_name: "Yamaha FZ-X" },
  { motorcycle_model_name: "Yamaha FZS 25" },
  { motorcycle_model_name: "Yamaha FZS-FI V3" },
  { motorcycle_model_name: "Yamaha FZS-FI V4" },
  { motorcycle_model_name: "Yamaha Gladiator" },
  { motorcycle_model_name: "Yamaha MT 15" },
  { motorcycle_model_name: "Yamaha MT-03" },
  { motorcycle_model_name: "Yamaha R1" },
  { motorcycle_model_name: "Yamaha R15 V2" },
  { motorcycle_model_name: "Yamaha R15 V3" },
  { motorcycle_model_name: "Yamaha R15 V4" },
  { motorcycle_model_name: "Yamaha R15 V4 M" },
  { motorcycle_model_name: "Yamaha R15S" },
  { motorcycle_model_name: "Yamaha R3" },
  { motorcycle_model_name: "Yamaha RayZR 125 Fi Hybrid" },
  { motorcycle_model_name: "Yamaha RX 100" },
  { motorcycle_model_name: "Yamaha Saluto 125" },
  { motorcycle_model_name: "Yezdi Adventure" },
  { motorcycle_model_name: "Yezdi Roadster" },
  { motorcycle_model_name: "Yezdi Scrambler" },
  { motorcycle_model_name: "Zontes 350R" },
  { motorcycle_model_name: "Zontes 350T" },
  { motorcycle_model_name: "Zontes 350X" },
  { motorcycle_model_name: "Zontes GK350" },
];

const motorcyclePartNames = [
  { part_name: "Other" },
  { part_name: "ABS Sensor" },
  { part_name: "Accelerator Cable" },
  { part_name: "Air Filter" },
  { part_name: "Alloy Wheels" },
  { part_name: "Alternator / Stator" },
  { part_name: "Battery" },
  { part_name: "Battery Terminal" },
  { part_name: "Bearings" },
  { part_name: "Brake Caliper" },
  { part_name: "Brake Disc / Rotor" },
  { part_name: "Brake Drum" },
  { part_name: "Brake Fluid" },
  { part_name: "Brake Lever" },
  { part_name: "Brake Pads" },
  { part_name: "Brake Pedal" },
  { part_name: "Brake Shoes" },
  { part_name: "Bushing Set" },
  { part_name: "Cam Chain Tensioner" },
  { part_name: "Camshaft" },
  { part_name: "Catalytic Converter" },
  { part_name: "Chain Adjuster" },
  { part_name: "Chain Lube" },
  { part_name: "Chain Sprocket" },
  { part_name: "Choke Cable" },
  { part_name: "Clutch Cable" },
  { part_name: "Clutch Plate" },
  { part_name: "Cone Set" },
  { part_name: "Coolant" },
  { part_name: "Crankcase" },
  { part_name: "Crankshaft" },
  { part_name: "Crash Guard" },
  { part_name: "Cylinder Head" },
  { part_name: "Drive Belt" },
  { part_name: "Drive Shaft" },
  { part_name: "ECU (Electronic Control Unit)" },
  { part_name: "Engine Control Sensor" },
  { part_name: "Engine Mounts" },
  { part_name: "Engine Oil" },
  { part_name: "Exhaust Component" },
  { part_name: "Exhaust Pipe" },
  { part_name: "Fairing" },
  { part_name: "Final Drive Assembly" },
  { part_name: "Flywheel" },
  { part_name: "Foot Pegs" },
  { part_name: "Fork Oil" },
  { part_name: "Fork Seal" },
  { part_name: "Frame Slider" },
  { part_name: "Front Suspension" },
  { part_name: "Fuel Cap" },
  { part_name: "Fuel Injector" },
  { part_name: "Fuel Tank" },
  { part_name: "Fuse" },
  { part_name: "Gaskets" },
  { part_name: "Gearbox Components" },
  { part_name: "Grab Rail" },
  { part_name: "Handlebar" },
  { part_name: "Headlight Bulb" },
  { part_name: "Headlight Housing" },
  { part_name: "Helmet Lock" },
  { part_name: "Horns" },
  { part_name: "Ignition Coil" },
  { part_name: "Indicator Lens" },
  { part_name: "Inner Tube" },
  { part_name: "Instrument Cluster" },
  { part_name: "Key Set" },
  { part_name: "Kick Starter" },
  { part_name: "Main Stand / Center Stand" },
  { part_name: "Master Cylinder" },
  { part_name: "Mudguard" },
  { part_name: "Nut Bolts etc." },
  { part_name: "Oil Filter" },
  { part_name: "Oxygen Sensor (Lambda)" },
  { part_name: "Piston Kit" },
  { part_name: "Radiator" },
  { part_name: "Radiator Cap" },
  { part_name: "Radiator Fan" },
  { part_name: "Rear Suspension" },
  { part_name: "Rear View Mirror Left" },
  { part_name: "Rear View Mirror Right" },
  { part_name: "Reflectors" },
  { part_name: "Regulator Rectifier" },
  { part_name: "Rim Tape" },
  { part_name: "Seat" },
  { part_name: "Shock Absorber" },
  { part_name: "Side Stand" },
  { part_name: "Silencer" },
  { part_name: "Spark Plug" },
  { part_name: "Speedometer Cable" },
  { part_name: "Sprocket Cover" },
  { part_name: "Starter Motor" },
  { part_name: "Steering Damper" },
  { part_name: "Steering Head Bearing" },
  { part_name: "Swingarm Bearing" },
  { part_name: "Switchgear" },
  { part_name: "Tachometer" },
  { part_name: "Taillight Bulb" },
  { part_name: "Taillight Housing" },
  { part_name: "Tank Pad" },
  { part_name: "Thermostat" },
  { part_name: "Throttle Body" },
  { part_name: "Throttle Cable" },
  { part_name: "Timing Chain / Belt" },
  { part_name: "Tires" },
  { part_name: "Tool Kit" },
  { part_name: "Turn Indicator" },
  { part_name: "Turn Indicator Relay" },
  { part_name: "Valve Set" },
  { part_name: "Water Pump" },
  { part_name: "Wheel Spindle / Axle" },
  { part_name: "Windshield / Visor" },
  { part_name: "Wiring Harness" },
];

const expenseTypes = [
  {
    expense_type: "Fuel",
    expense_type_color: "#FFAC30",
    is_motorcycle_linked: YES,
    odometer_reading_required: YES,
    load_motorcycle_parts: NO,
    fuel_quantity_required: YES,
  },
  {
    expense_type: "Repairs",
    expense_type_color: "#F0586B",
    is_motorcycle_linked: YES,
    odometer_reading_required: YES,
    load_motorcycle_parts: YES,
    fuel_quantity_required: NO,
  },
  {
    expense_type: "Accessories",
    expense_type_color: "#90caf9",
    is_motorcycle_linked: YES,
    odometer_reading_required: NO,
    load_motorcycle_parts: NO,
    fuel_quantity_required: NO,
  },
  {
    expense_type: "Riding Gear",
    expense_type_color: "#ba68c8",
    is_motorcycle_linked: NO,
    odometer_reading_required: NO,
    load_motorcycle_parts: NO,
    fuel_quantity_required: NO,
  },
  {
    expense_type: "Food",
    expense_type_color: "#66bb6a",
    is_motorcycle_linked: NO,
    odometer_reading_required: NO,
    load_motorcycle_parts: NO,
    fuel_quantity_required: NO,
  },
  {
    expense_type: "Stay",
    expense_type_color: "#3f51b5",
    is_motorcycle_linked: NO,
    odometer_reading_required: NO,
    load_motorcycle_parts: NO,
    fuel_quantity_required: NO,
  },
  {
    expense_type: "Others",
    expense_type_color: "#919191",
    is_motorcycle_linked: NO,
    odometer_reading_required: NO,
    load_motorcycle_parts: NO,
    fuel_quantity_required: NO,
  },
];

const rideCancelReasons = [
  {
    cancel_reason: "Bad Weather",
    reason_description:
      "The weather conditions were unfavorable or unsafe for the motorcycle ride.",
  },
  {
    cancel_reason: "Emergency Situation",
    reason_description:
      "Participant faced an unexpected emergency, preventing them from joining the ride.",
  },
  {
    cancel_reason: "Mechanical Issues",
    reason_description:
      "The participant's motorcycle or vehicle experienced technical problems preventing them from particip",
  },
  {
    cancel_reason: "Health Issues",
    reason_description:
      "Participant or someone close to them had health concerns, making it impossible to attend the ride.",
  },
  {
    cancel_reason: "Change in Plans",
    reason_description:
      "The participant had a sudden change in their schedule or plans, leading to the cancellation of the r",
  },
  {
    cancel_reason: "Group Consensus",
    reason_description:
      "The decision to cancel the ride was made collectively by the participants.",
  },
  {
    cancel_reason: "Route/Event Changes",
    reason_description:
      "Alterations in the planned route or event caused the participant to cancel their ride.",
  },
  {
    cancel_reason: "Personal Commitments",
    reason_description:
      "Participants had prior personal commitments that clashed with the scheduled ride.",
  },
  {
    cancel_reason: "Unforeseen Circumstances",
    reason_description:
      "Unexpected situations arose, making it impossible for the participant to join the ride.",
  },
  {
    cancel_reason: "Insufficient Participants",
    reason_description:
      "The ride was canceled due to an insufficient number of participants.",
  },
  {
    cancel_reason: "Technical Issues with the App",
    reason_description:
      "Technical problems within the RoadBee app prevented the participant from confirming their attendance",
  },
  {
    cancel_reason: "Safety Concerns",
    reason_description:
      "The participant had concerns about safety during the ride, leading to cancellation.",
  },
  {
    cancel_reason: "Communication Issues",
    reason_description:
      "Problems in communication, such as inability to reach other participants, resulted in the cancellati",
  },
  {
    cancel_reason: "Vehicle Accidents",
    reason_description:
      "The participant or someone closely related had a recent vehicle accident, making it unsafe to partic",
  },
  {
    cancel_reason: "Personal Obligations",
    reason_description:
      "Personal responsibilities or obligations prevented the participant from joining the ride.",
  },
];

const serverMastersData = {
  bloodGroups,
  motorcycleNames,
  motorcyclePartNames,
  expenseTypes,
  rideCancelReasons,
};

export default serverMastersData;