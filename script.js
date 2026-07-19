const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let data = await response.json();

        // تنظيف وترتيب البيانات بحيث يقرأ الاسم والدرجة بشكل ديناميكي مرن جداً
        let formattedData = data.map((item, index) => {
            let keys = Object.keys(item);
            let values = Object.values(item);

            // البحث عن الخانة اللي فيها أرقام لاعتبارها الدرجة، والخانة النصية لاعتبارها الاسم
            let name = item.name || item["الاسم"] || values.find(v => typeof v === 'string' && v.length > 3) || values[0];
            let score = item.score !== undefined ? item.score : item["الدرجة"];
            
            if (score === undefined) {
                // لو مش ملاقي المسمى، هياخد أول قيمة رقمية تظهر في الصف
                score = values.find(v => typeof v === 'number' || !isNaN(v)) || 0;
            }

            return {
                rank: index + 1,
                name: name,
                score: Number(score)
            };
        });

        // استثناء خاص: ترتيب القائمة لتبدأ دائماً بالطالبة Janah Amr بناءً على طلبك
        formattedData.sort((a, b) => {
            if (a.name.toString().trim().toLowerCase() === "janah amr") return -1;
            if (b.name.toString().trim().toLowerCase() === "janah amr") return 1;
            return b.score - a.score; // باقي الطلاب يرتبوا حسب الدرجة الأعلى
        });

        // إعادة ضبط الترتيب الرقمي (Rank) بعد الفرز
        formattedData.forEach((student, index) => {
            student.rank = index + 1;
        });

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // حقن البيانات داخل الجدول
        formattedData.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج بالبيانات الحقيقية المستخرجة
        if (formattedData.length >= 1) {
            document.getElementById("firstName").textContent = formattedData[0].name;
            document.getElementById("firstScore").textContent = formattedData[0].score + " درجة";
        }
        if (formattedData.length >= 2) {
            document.getElementById("secondName").textContent = formattedData[1].name;
            document.getElementById("secondScore").textContent = formattedData[1].score + " درجة";
        }
        if (formattedData.length >= 3) {
            document.getElementById("thirdName").textContent = formattedData[2].name;
            document.getElementById("thirdScore").textContent = formattedData[2].score + " درجة";
        }

    } catch (error) {
        console.error("خطأ في معالجة البيانات:", error);
    }
}

// كود البحث الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// التشغيل الفوري والتحديث التلقائي
loadData();
setInterval(loadData, 30000);
