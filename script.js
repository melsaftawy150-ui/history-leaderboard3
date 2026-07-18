// ضع رابط الـ API الجديد والمستنسخ من خطوة النشر السابقة هنا بين القوسين
const API_URL = "ضع_الرابط_الجديد_هنا";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // عرض البيانات بشكل منضبط في أعمدتها الصحيحة داخل الجدول
        data.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج (المراكز الثلاثة الأولى) بشكل صحيح
        if (data.length >= 3) {
            document.getElementById("firstName").textContent = data[0].name;
            document.getElementById("firstScore").textContent = data[0].score;

            document.getElementById("secondName").textContent = data[1].name;
            document.getElementById("secondScore").textContent = data[1].score;

            document.getElementById("thirdName").textContent = data[2].name;
            document.getElementById("thirdScore").textContent = data[2].score;
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

loadData();
setInterval(loadData, 30000);
