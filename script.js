const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        // استخراج البيانات بناءً على ترتيب القيم الداخلي منعاً لاختلاف المسميات
        let students = data.map((item) => {
            let values = Object.values(item);
            let name = values[0] || "بدون اسم";
            // البحث عن أول قيمة رقمية صالحة لاعتبارها الدرجة
            let score = values.find((v, idx) => idx > 0 && !isNaN(v) && v !== "") || 0;
            return { name: name.toString().trim(), score: Number(score) };
        });

        // ترتيب الطلاب تنازلياً حسب الدرجة الأعلى
        students.sort((a, b) => b.score - a.score);

        // استثناء: تقديم الطالبة Janah Amr بناءً على التعديل السابق
        students.sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA === "janah amr" || nameA.includes("جنا عمرو")) return -1;
            if (nameB === "janah amr" || nameB.includes("جنا عمرو")) return 1;
            return 0;
        });

        // حقن الصفوف داخل الجدول
        students.forEach((student, index) => {
            let rank = index + 1;
            tableBody.innerHTML += `
                <tr>
                    <td>${rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث كروت المنصة بالدرجات الحقيقية
        if (students.length >= 1) {
            if(document.getElementById("firstName")) document.getElementById("firstName").textContent = students[0].name;
            if(document.getElementById("firstScore")) document.getElementById("firstScore").textContent = students[0].score + " درجة";
        }
        if (students.length >= 2) {
            if(document.getElementById("secondName")) document.getElementById("secondName").textContent = students[1].name;
            if(document.getElementById("secondScore")) document.getElementById("secondScore").textContent = students[1].score + " درجة";
        }
        if (students.length >= 3) {
            if(document.getElementById("thirdName")) document.getElementById("thirdName").textContent = students[2].name;
            if(document.getElementById("thirdScore")) document.getElementById("thirdScore").textContent = students[2].score + " درجة";
        }

    } catch (error) {
        console.error("خطأ في معالجة البيانات:", error);
    }
}

// كود البحث
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

loadData();
setInterval(loadData, 30000);
