using System.IO.Ports;
// try catch ספיציפי
//לעבוד יותר עם design patterns
public static class ComCommunication
{
    static string COM_name = "";
    static string nickname = "";
    static bool isOn = false;
    static SerialPort COMport;


    public static void startCommunication(string com_name)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Trying To Connect To " + com_name);
            COM_name = com_name;
            COMport = new SerialPort(com_name);
            COMport.Open();
            isOn = true;
            startListening();
        } catch
        {
            Console.WriteLine("Unable to connect to " + com_name);
        }
    }

    public static void startCommunication(string com_name, int baud_rate)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Trying To Connect To " + com_name);
            COM_name = com_name;
            COMport = new SerialPort(com_name, baud_rate);
            COMport.Open();
            isOn = true;
            startListening();
        } catch
        {
            Console.WriteLine("Unable to connect to " + com_name);
        }
    }
    

    private static void startListening()
    {
        Console.ForegroundColor = ConsoleColor.White;
        Console.WriteLine("Starting listening on port " + COM_name);
        string m;
        nickname = COMport.ReadLine();
        Console.WriteLine("New Connection With "+ nickname + " On Port " + COM_name);
        while (isOn)
        {
            m = COMport.ReadLine();
            if (m.ToLower() == "exit")
            {
                endConnection();
            } else {
                Console.ForegroundColor = ConsoleColor.DarkGreen;

                Console.Write("New Messege from " + nickname +": ");
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write(m + "\n");
            }
        }
    }

    private static void endConnection()
    {
        isOn = false;
        COMport.Close();
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("\nConnection ended with code 'exit'");
    }
}



public class program1
{
    public static void Main()
    {
        string name = "COM7";
        ComCommunication.startCommunication(name, 10); 
        Console.ForegroundColor = ConsoleColor.White;
    }
}